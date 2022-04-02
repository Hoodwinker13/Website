import json
import os
from datetime import datetime
import uuid
import pickle

import werkzeug
from werkzeug.utils import secure_filename

werkzeug.cached_property = werkzeug.utils.cached_property
from flask import Blueprint
from flask import Response
from flask import request
from flask import render_template
from flask import redirect

from .config import config_by_name

from elasticsearch import Elasticsearch

from flask_mail import Mail, Message

__root__ = os.path.dirname(os.path.abspath(__file__))

main_bp = Blueprint("main", __name__)
cfg = config_by_name[os.getenv("FLASK_ENV", "dev")]
img_static = cfg.FILE_PATH

es = Elasticsearch(cfg.ES_HOST)

mail = Mail()
senders = 'minjunekim72@gmail.com'

def create_response(body, status, content_type="application/json;charset=utf-8", headers=None,
                    mimetype="application/json;charset=utf-8", direct_passthrough=False):
    params = {
        "response": json.dumps(body),
        "status": status,
        "content_type": content_type,
        "headers": headers,
        "mimetype": mimetype,
        "direct_passthrough": direct_passthrough,
    }
    return Response(**params)

@main_bp.route('/index')
def index():
    return render_template('index.html')

@main_bp.route('/about')
def about():
    return render_template('about.html')

@main_bp.route('/setup')
def setup():
    return render_template('setup.html')

@main_bp.route('/procedures')
def procedures():
    return render_template('procedures.html')

@main_bp.route('/data')
def data():
    return render_template('data.html')

@main_bp.route('/data_input')
def data_input():
    return render_template('data_input.html')

@main_bp.route('/approval')
def approval():
    return render_template('approval.html')

@main_bp.route('/approval_popup')
def approval_popup():
    return render_template('approval_popup.html')

@main_bp.route('/')
def random():
    return redirect('/index')

@main_bp.route('/authentication', methods=['POST'])
def auth():
    request_json = request.get_json()
    password = request_json['password']

    if password == cfg.PASSWORD:
        return create_response('success', 200)
    else:
        return create_response('wrong password', 401) 

@main_bp.route('/popup', methods=['GET'])
def popup_data():
    ids = request.args.get('ids')
    res = es.search(
        index='mask_data',
        doc_type='mask_data',
        body={
            'query' : {
                'term' : {
                    '_id' : ids,
                }
            }
        },
    )

    data = res['hits']['hits'][0]['_source']

    img_file_name = data['img_name'] if data['img_name'] != 'null' else ''

    return render_template('popup.html', img_file=img_file_name, mask_data=data)

@main_bp.route('/approve', methods=['POST'])
def approve():
    request_json = request.get_json()
    id = request_json['id']
    message_text = request_json['message']

    res = es.update(
        index = 'mask_data',
        doc_type='mask_data',
        id=id,
        body={
            "doc": {
                "upload" : 1
            }
        }
    )

    try:
        res = es.search(
            index = 'mask_data',
            doc_type='mask_data',
            body={
                'query' : {
                    'term' : {
                        '_id' : id,
                    }
                }
            }
        )
        email = res['hits']['hits'][0]['_source']['contact_info']

        if len(email) != 0:
            msg = Message('Approval', sender = senders, recipients = [email])
            msg.body = message_text

            mail.send(msg)
    except Exception as e:
        print(e)

    return create_response('success', 200)

@main_bp.route('/deletion', methods=['POST'])
def deletion():
    request_json = request.get_json()
    id = request_json['id']

    res = es.delete(
        index = 'mask_data',
        doc_type='mask_data',
        id=id
    )

    return create_response('success', 200)

@main_bp.route('/ping', methods=['GET'])
def get():
    '''
    Server Health Checker
    '''
    body = {
        'message': 'pong',
    }
    return create_response(body, 200)


@main_bp.route('/search', methods=['POST'])
def search():
    if request.headers['Content-Type'] == 'application/json' :
        data = request.get_json()
        name = data['name']
    else:
        name = request.args.get('name')

    query = {
        'match' : {
            'name' : {
                'query' : name,
                'fuzziness' : 2,
            }
        }
    }

    res = es.search(
        index='mask_data',
        doc_type='mask_data',
        body={
            'query' : query,
        },
    )

    return create_response(res, 200)

@main_bp.route('/getAll', methods=['POST'])
def allData():
    res = es.search(
        index='mask_data',
        doc_type='mask_data',
        body={
            'sort': {
                'name':'asc'
            },
            'query':{
                'match_all' : {},
            },
            'size' : 100
        }
    )

    return create_response(res, 200)


@main_bp.route('/completion', methods=['POST'])
def suggestion():
    if request.headers['Content-Type'] == 'application/json' :
        data = request.get_json()
        name = data['name']
    else:
        name = request.args.get('name')

    query = {
        'completion' : {
            'prefix' : name,
            'completion' : {
                'field' : 'name',
                'size' : 5,
            }
        }
    }

    res = es.search(
        index='mask_completion',
        doc_type='mask_completion',
        body={
            'suggest':query,
        },
    )

    completion_list = []
    res_data = res['suggest']['completion'][0]['options']
    for completion in res_data:
        completion_list.append(completion['text'])

    return create_response({
        'names' : completion_list,
        'length' : len(completion_list)
    }, 200)

@main_bp.route('/update', methods=['POST'])
def update() :
    data = json.loads(request.form['mask_data'])

    try:
        doc_data = {
                    'loading_particles' : data['loading_particles'],
                    'mask_type' : data['mask_type'],
                    'name' : data['name'],
                    'efficiency_03' : data['efficiency_03'],
                    'efficiency_05' : data['efficiency_05'],
                    'efficiency_1' : data['efficiency_1'],
                    'efficiency_3' : data['efficiency_3'],
                    'efficiency_5' : data['efficiency_5'],
                    'efficiency_10' : data['efficiency_10'],
                    'error_03' : data['error_03'],
                    'error_05' : data['error_05'],
                    'error_1' : data['error_1'],
                    'error_3' : data['error_3'],
                    'error_5' : data['error_5'],
                    'error_10' : data['error_10'],
                    'pa' : data['pa'],
                    'vair' : data['vair'],
                    't' : data['t'],
                    'rh' : data['rh'],
                    'test_date' : datetime.strptime(data['test_date'], '%Y.%m.%d'),
                    'test_city' : data['test_city'],
                    'comment' : data['comment'],
                    'username' : data['username'],
                    'contact_info' : data['contact_info'],
                    'association' : data['association'],
                    'upload' : 0,
		}
        doc_name = {
                    'name' : data['name'],
                }
    except KeyError:
        return create_response('missing parameter', 400)
    except ValueError:
        return create_response('Data format Error', 400)

    try:
        file = request.files['file']
    except Exception:
        return create_response('File Upload Error', 400)

    rand_file_name = str(uuid.uuid4())+os.path.splitext(file.filename)[1]

    doc_data['img_name'] = rand_file_name

    res_data = es.index(index='mask_data', doc_type='mask_data', body=doc_data) # index에 insert
    res_name = es.index(index='mask_completion', doc_type='mask_completion', body=doc_name)
    file.save(os.path.join(img_static, rand_file_name))

    if not (isinstance(res_data, dict) or isinstance(res_name, dict)):
        return create_response('failed', 400)
    else:
        return create_response('success', 200)
