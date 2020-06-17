/*
 * JavaScript file for the application to demonstrate
 * using the API
 */

// Create the namespace instance
let ns = {};

// Create the model instance
ns.model = (function() {
    'use strict';

    let $event_pump = $('body');

    // Return the API
    return {
        'read': function() {
            let ajax_options = {
                type: 'GET',
                url: 'api/people',
                accepts: 'application/json',
                dataType: 'json'
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_read_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        create: function(name, time1, time2, time3) {
            let ajax_options = {
                type: 'POST',
                url: 'api/people',
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    'name': name,
                    'time1': time1,
                    'time2': time2,
                    'time3': time3
                })
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_create_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        update: function(name, time1, time2, time3) {
            let ajax_options = {
                type: 'PUT',
                url: 'api/people/' + name,
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    'name': name,
                    'time1': time1,
                    'time2': time2,
                    'time3': time3
                })
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_update_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        'delete': function(name) {
            let ajax_options = {
                type: 'DELETE',
                url: 'api/people/' + name,
                accepts: 'application/json',
                contentType: 'plain/text'
            };
            $.ajax(ajax_options)
            .done(function(name) { /////////
                $event_pump.trigger('model_delete_success', [name]); ///////////////
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        }
    };
}());

// Create the view instance
ns.view = (function() {
    'use strict';

    let $name = $('#name'),
        $time1 = $('#time1'),
        $time2 = $('#time2'),
        $time3 = $('#time3');

    // return the API
    return {
        reset: function() {
            $name.val('').focus;
            $time1.val('');
            $time2.val('');
            $time3.val('');
        },
        update_editor: function(name, time1, time2, time3) {
            $name.val(name).focus;
            $time1.val(time1);
            $time2.val(time2);
            $time3.val(time3);
        },
        build_table: function(people) {
            let rows = ''

            // clear the table
            $('.people table > tbody').empty();

            // did we get a people array?
            if (people) {
                for (let i=0, l=people.length; i < l; i++) {
                    rows += `<tr><td class="name">${people[i].name}</td><td class="time1">${people[i].time1}</td><td class="time2">${people[i].time2}</td><td class="time3">${people[i].time3}</td></tr>`;
                }
                $('table > tbody').append(rows);
            }
        },
        error: function(error_msg) {
            $('.error')
                .text(error_msg)
                .css('visibility', 'visible');
            setTimeout(function() {
                $('.error').css('visibility', 'hidden');
            }, 3000)
        }
    };
}());

// Create the controller
ns.controller = (function(m, v) {
    'use strict';

    let model = m,
        view = v,
        $event_pump = $('body'),
        $name = $('#name'),
        $time1 = $('#time1'),
        $time2 = $('#time2'),
        $time3 = $('#time3');


    // Get the data from the model after the controller is done initializing
    setTimeout(function() {
        model.read();
    }, 100)

    // Validate input
    function validate(name, time1, time2, time3) {
        return name !== "" && time1 !== "" && time2 !== "" && time3 !== "";
    }

    // Create our event handlers
    $('#create').click(function(e) {
        let name = $name.val(),
            time1 = $time1.val(),
            time2 = $time2.val(),
            time3 = $time3.val();

        e.preventDefault();

        if (validate(name, time1, time2, time3)) {
            model.create(name, time1, time2, time3)
        } else {
            alert('Problem with first or last name input');
        }
    });

    $('#update').click(function(e) {
        let name = $name.val(),
            time1 = $time1.val(),
            time2 = $time2.val(),
            time3 = $time3.val();

        e.preventDefault();

        if (validate(name, time1, time2, time3)) {
            model.update(name, time1, time2, time3)
        } else {
            alert('Problem with name or time input');
        }
        e.preventDefault();
    });

    $('#delete').click(function(e) {
        let name = $name.val();

        e.preventDefault();

        if (validate('placeholder', name)) { //////////////////// placeholder??
            model.delete(name)
        } else {
            alert('Problem with name input');
        }
        e.preventDefault();
    });

    $('#reset').click(function() {
        view.reset();
    })

    $('table > tbody').on('dblclick', 'tr', function(e) {
        let $target = $(e.target),
            name,
            time1,
            time2,
            time3;

        name = $target
            .parent()
            .find('td.name')
            .text();

        time1 = $target
            .parent()
            .find('td.time1')
            .text();

        time2 = $target
            .parent()
            .find('td.time2')
            .text();

        time3 = $target
            .parent()
            .find('td.time3')
            .text();

        view.update_editor(name, time1, time2, time3);
    });

    // Handle the model events
    $event_pump.on('model_read_success', function(e, data) {
        view.build_table(data);
        view.reset();
    });

    $event_pump.on('model_create_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_update_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_delete_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_error', function(e, xhr, textStatus, errorThrown) {
        let error_msg = textStatus + ': ' + errorThrown + ' - ' + xhr.responseJSON.detail;
        view.error(error_msg);
        console.log(error_msg);
    })
}(ns.model, ns.view));