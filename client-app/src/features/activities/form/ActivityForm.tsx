import React, { FormEvent, useState } from 'react'
import { Button, Form, Segment } from 'semantic-ui-react'
import { v4 as uuid } from "uuid";


import { IActivity } from '../../../app/models/activities'

interface IProps {
    activity: IActivity | null,
    setEditMode: (editMode: boolean) => void,
    createActivity: (activity: IActivity) => void,
    editActivity: (activity: IActivity) => void,
    submitting: boolean
}

export const ActivityForm: React.FC<IProps> = ({
    setEditMode,
    activity: initialFormState,
    createActivity,
    editActivity,
    submitting
}) => {

    const initializeForm = () => {
        if (initialFormState) {
            return initialFormState;
        }
        else {
            return {
                id: "",
                title: "",
                description: "",
                date: "",
                city: "",
                venue: "",
                category: ""
            } as IActivity
        }
    }

    const [activity, setActivity] = useState<IActivity>(initializeForm);

    const handleSubmit = () => {
        if (activity.id.length === 0) {
            let newActivity = {
                ...activity,
                id: uuid()
            }
            createActivity(newActivity);
        }
        else {
            editActivity(activity);
        }
    }

    const handleInputChange = (evt: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = evt.currentTarget;
        setActivity({ ...activity, [name]: value })
    }

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit}>
                <Form.Input onChange={handleInputChange} name='title'
                    placeholder='Title' value={activity.title}></Form.Input>
                <Form.TextArea onChange={handleInputChange} name='description'
                    rows={2} placeholder='Description' value={activity.description} ></Form.TextArea>
                <Form.Input
                    onChange={handleInputChange}
                    name='category'
                    placeholder='Category'
                    value={activity.category} />
                <Form.Input
                    onChange={handleInputChange}
                    name='date'
                    type='datetime-local'
                    placeholder='Date'
                    value={activity.date}></Form.Input>
                <Form.Input onChange={handleInputChange} name='city'
                    placeholder='City' value={activity.city}></Form.Input>
                <Form.Input onChange={handleInputChange} name='venue'
                    placeholder='Venue' value={activity.venue}></Form.Input>
                <Button
                    positive
                    floated='right'
                    type='submit'
                    content='Submit'
                    loading={submitting}
                />
                <Button onClick={() => setEditMode(false)} floated='right' type='button' content='Cancel' />
            </Form>
        </Segment>
    )
}
