function popup(id) {
    var url = "/popup?ids=" + id;
    var name = "mask data";
    var option = "width=1000, height=500, location=no, toolbars=no, status=no";

    window.open(url, name, option);
}

$(document).ready(function() {
    var coloring = function(name){
        if(parseFloat(name) < 70){
            return '<td style = "width:70px; background-color: red;">' + name + '</td>';
        }
        else if(parseFloat(name) >= 99){
            return '<td style = "width:70px; background-color: cyan;">' + name + '</td>';
        }
        else if(parseFloat(name) >= 90 && parseFloat(name) < 95 ){
            return '<td style = "width:70px; background-color: yellow;">' + name + '</td>';
        }
        else if(parseFloat(name) >= 95 && parseFloat(name) < 99){
            return '<td style = "width:70px; background-color: green;">' + name + '</td>';
        }
        else if(parseFloat(name) >= 70 && parseFloat(name) < 90){
            return '<td style = "width:70px; background-color: orange;">' + name + '</td>';
        }
        else{
            return '<td style = "width:70px">' + name + '</td>';
        }
    }

    var error = function(name){
        if(parseFloat(name) > 5){
            return '<td style = "width:50px; background-color: red;">' + name + '</td>';
        }
        else if(parseFloat(name) <= 1){
            return '<td style = "width:50px; background-color: green;">' + name + '</td>';
        }
        else if(parseFloat(name) <= 5 && parseFloat(name) > 1 ){
            return '<td style = "width:50px; background-color: yellow;">' + name + '</td>';
        }
        else{
            return '<td style = "width:50px">' + name + '</td>';
        }
    }
    var error_10 = function(name){
        if(parseFloat(name) > 5){
            return '<td style = "width:70px; background-color: red; border-right: 3px solid black;">' + name + '</td>';
        }
        else if(parseFloat(name) <= 1){
            return '<td style = "width:70px; background-color: green; border-right: 3px solid black;">' + name + '</td>';
        }
        else if(parseFloat(name) <= 5 && vparseFloat(name) > 1 ){
            return '<td style = "width:70px; background-color: yellow; border-right: 3px solid black;">' + name + '</td>';
        }
        else{
            return '<td style = "width:70px; border-right: 3px solid black;">' + name + '</td>';
        }
    }

    var efficiency_03 = function(name){
        if(parseFloat(name) < 70){
            return '<td style = "width:70px; background-color: red; border-left: 3px solid black;">' + name + '</td>';
        }
        else if(parseFloat(name) >= 99){
            return '<td style = "width:70px; background-color: cyan; border-left: 3px solid black;">' + name + '</td>';
        }
        else if(parseFloat(name) >= 90 && parseFloat(name) < 95 ){
            return '<td style = "width:70px; background-color: yellow; border-left: 3px solid black;">' + name + '</td>';
        }
        else if(parseFloat(name) >= 95 && parseFloat(name) < 99){
            return '<td style = "width:70px; background-color: green; border-left: 3px solid black;">' + name + '</td>';
        }
        else if(parseFloat(name) >= 70 && parseFloat(name) < 90){
            return '<td style = "width:70px; background-color: orange; border-left: 3px solid black;">' + name + '</td>';
        }
        else{
            return '<td style = "width:70px; border-left: 3px solid black;">' + name + '</td>';
        }
    }

    var efficiency_10 = function(name){
        if(parseFloat(name) < 70){
            return '<td style = "width:70px; background-color: red; border-right: 3px solid black;">' + name + '</td>';
        }
        else if(parseFloat(name) >= 99){
            return '<td style = "width:70px; background-color: cyan; border-right: 3px solid black;">' + name + '</td>';
        }
        else if(parseFloat(name) >= 90 && parseFloat(name) < 95 ){
            return '<td style = "width:70px; background-color: yellow; border-right: 3px solid black;">' + name + '</td>';
        }
        else if(parseFloat(name) >= 95 && parseFloat(name) < 99){
            return '<td style = "width:70px; background-color: green; border-right: 3px solid black;">' + name + '</td>';
        }
        else if(parseFloat(name) >= 70 && parseFloat(name) < 90){
            return '<td style = "width:70px; background-color: orange; border-right: 3px solid black;">' + name + '</td>';
        }
        else{
            return '<td style = "width:70px; border-right: 3px solid black;">' + name + '</td>';
        }
    }
    if(localStorage['search_data'] != null) {
        data = $.parseJSON(localStorage['search_data']);
        localStorage.removeItem('search_data');
        $("table tbody").remove();
        data = data['hits']['hits'];
        var html = '<tbody>';
        $.each(data, function (key, value) {
            ids = value['_id'];
            value = value['_source'];
            if(value['upload'] == 1){
            html += '<tr>';
                html += '<td style="width: 70px">' + value['loading_particles'] + '</td>';
                html += '<td style="width: 80px">' + value['mask_type'] + '</td>';
                html += `<td style="width: 100px; cursor:hand; color:blue; text-decoration: underline;" onclick="popup('${ids}');">` + value['name'] + '</td>';
                html += efficiency_03(value['efficiency_03']);
                html += coloring(value['efficiency_05']);
                html += coloring(value['efficiency_1']);
                html += coloring(value['efficiency_3']);
                html += coloring(value['efficiency_5']);
                html += efficiency_10(value['efficiency_10']);
                html += error(value['error_03']);
                html += error(value['error_05']);
                html += error(value['error_1']);
                html += error(value['error_3']);
                html += error(value['error_5']);
                html += error_10(value['error_10']);
                html += '<td style="width: 50px">' + value['pa'] + '</td>';
                html += '<td style="width: 50px">' + value['vair'] + '</td>';
                html += '<td style="width: 50px">' + value['t'] + '</td>';
                html += '<td style="width: 50px">' + value['rh'] + '</td>';
                html += '<td style="width: 80px">' + value['test_date'] + '</td>';
                html += '<td style = "width:100px">' + value['test_city'] + '</td>';
                var comment = '<td style = "width:100px">' + value['comment'] + '</td>';
                html += '<td style = "width:100px">' + value['username'] + '</td>';
                var comment = '<td style = "width:100px">' + value['association'] + '</td>';
                var comment = '<td style = "width:100px">' + value['contact_info'] + '</td>';
                html += '</tr>';
            }
        });
        html += '</tbody>';
        $("table").append(html);
    };

    var search = function() {
        var name=$('#name').val();

        var params = {
            "name":name
        };
        $.ajax({
            url:"http://localhost:5000/search",
            type:"POST",
            data:JSON.stringify(params),
            headers:{"Content-type":"application/json"},

            success:function(data) {
                $("table tbody").remove();
                data = data['hits']['hits'];
                var html = '<tbody>';
                $.each(data, function (key, value) {
                    ids = value['_id'];
                    value = value['_source'];
                    if(value['upload'] == 1){
                    html += '<tr>';
                html += '<td style="width: 70px">' + value['loading_particles'] + '</td>';
                html += '<td style="width: 80px">' + value['mask_type'] + '</td>';
                html += `<td style="width: 100px; cursor:hand; color:blue; text-decoration: underline;" onclick="popup('${ids}');">` + value['name'] + '</td>';
                html += efficiency_03(value['efficiency_03']);
                html += coloring(value['efficiency_05']);
                html += coloring(value['efficiency_1']);
                html += coloring(value['efficiency_3']);
                html += coloring(value['efficiency_5']);
                html += efficiency_10(value['efficiency_10']);
                html += error(value['error_03']);
                html += error(value['error_05']);
                html += error(value['error_1']);
                html += error(value['error_3']);
                html += error(value['error_5']);
                html += error_10(value['error_10']);
                html += '<td style="width: 50px">' + value['pa'] + '</td>';
                html += '<td style="width: 50px">' + value['vair'] + '</td>';
                html += '<td style="width: 50px">' + value['t'] + '</td>';
                html += '<td style="width: 50px">' + value['rh'] + '</td>';
                html += '<td style="width: 80px">' + value['test_date'] + '</td>';
                html += '<td style = "width:100px">' + value['test_city'] + '</td>';
                var comment = '<td style = "width:100px">' + value['comment'] + '</td>';
                html += '<td style = "width:100px">' + value['username'] + '</td>';
                var comment = '<td style = "width:100px">' + value['association'] + '</td>';
                var comment = '<td style = "width:100px">' + value['contact_info'] + '</td>';
                html += '</tr>';
                    }
                });
                html += '</tbody>';
                $("table").append(html);
            },
            error:function(data) {
                alert("error");
            }
        });
    };

    $('#submit').click(search);
    $('#name').keyup(function(event) {
        if(event.keyCode==13) {
            search();
        }

        var name=$('#name').val();

        if(name != null) {
            var params = {
                "name":name
            };
            $.ajax({
                url:"http://localhost:5000/completion",
                type:"POST",
                data:JSON.stringify(params),
                headers:{"Content-type":"application/json"},

                success:function(data){
                    var names = []
                    for(var i=0; i<data['length']; i++) {
                        names.push(data['names'][i]);
                    }
                    
                    $('#name').autocomplete({
                    source:names,
                    autoFocus:true
                    });
                }
            });
        }
    });

});
