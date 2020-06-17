"""
This is the people module and supports all the ReST actions for the
PEOPLE collection
"""

# System modules
from datetime import datetime

# 3rd party modules
from flask import make_response, abort

# Data to serve with our API
PEOPLE = {
    "name": {
        "name":"",
        "time1":"",
        "time2":"",
        "time3":"",
    },
}


def read_all():
    """
    This function responds to a request for /api/people
    with the complete lists of people
    :return:        json string of list of people
    """
    # Create the list of people from our data
    return [PEOPLE[key] for key in sorted(PEOPLE.keys())]


def read_one(name):
    """
    This function responds to a request for /api/people/{id}
    with one matching person from people
    :param id:   id of person to find
    :return:        person matching last name
    """
    # Does the person exist in people?
    if name in PEOPLE:
        person = PEOPLE.get(name)

    # otherwise, nope, not found
    else:
        abort(
            404, "Person with name {name} not found".format(name=name)
        )
    return person


def create(person):
    """
    This function creates a new person in the people structure
    based on the passed in person data
    :param person:  person to create in people structure
    :return:        201 on success, 406 on person exists
    """
    name = person.get("name", None)
    time1 = person.get("time1", None)
    time2 = person.get("time2", None)
    time3 = person.get("time3", None)

    # Does the person exist already?
    if name not in PEOPLE and name is not None:
        PEOPLE[name] = {
            "name": name,
            "time1": time1,
            "time2": time2,
            "time3": time3,
        }
        return PEOPLE[name], 201

    # Otherwise, they exist, that's an error
    else:
        abort(
            406,
            "Person with name {name} already exists".format(name=name),
        )


def update(name, person):
    """
    This function updates an existing person in the people structure

    :param name:   name of person to update in the people structure
    :param person:  person to update
    :return:        updated person structure
    """
    # Does the person exist in people?
    if name in PEOPLE:
        PEOPLE[name]["name"] = person.get("name")
        PEOPLE[name]["time1"] = person.get("time1")
        PEOPLE[name]["time2"] = person.get("time2")
        PEOPLE[name]["time3"] = person.get("time3")

        return PEOPLE[name]

    # otherwise, nope, that's an error
    else:
        abort(
            404, "Person with name {name} not found".format(name=name)
        )


def delete(name):
    """
    This function deletes a person from the people structure
    :param name:   last name of person to delete
    :return:        200 on successful delete, 404 if not found
    """
    # Does the person to delete exist?
    if name in PEOPLE:
        del PEOPLE[name]
        return make_response(
            "{name} successfully deleted".format(name=name), 200
        )

    # Otherwise, nope, person to delete not found
    else:
        abort(
            404, "Person with name {name} not found".format(name=name)
        )