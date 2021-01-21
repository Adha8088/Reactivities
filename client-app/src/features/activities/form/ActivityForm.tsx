import { observer } from 'mobx-react-lite';
import React, { FormEvent, useContext, useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom';
import { Button, Form, Grid, Segment } from 'semantic-ui-react'
import { v4 as uuid } from "uuid";

import { IActivity } from '../../../app/models/activities'
import ActivityStore from "../../../app/stores/activityStore";

interface FormParams {
    id: string
}

const ActivityForm: React.FC<RouteComponentProps<FormParams>> = ({
    match,
    history
}) => {
    const {
        createActivity,
        editActivity,
        submitting,
        activity: initialFormState,
        loadActivity,
        clearActivity
    } = useContext(ActivityStore);

    const [activity, setActivity] = useState<IActivity>({
        id: "",
        title: "",
        description: "",
        date: "",
        city: "",
        venue: "",
        category: ""
    });

    useEffect(() => {
        const { id } = match.params;
        if (id && activity.id.length === 0) {
            loadActivity(id)
                .then(() => {
                    initialFormState && setActivity(initialFormState);
                })
        }
        return clearActivity;
    }, [loadActivity, clearActivity, match.params, match.params.id, initialFormState, activity.id.length])

    const handleSubmit = () => {
        if (activity.id.length === 0) {
            let newActivity = {
                ...activity,
                id: uuid()
            }
            createActivity(newActivity)
                .then(() => {
                    history.push(`/activities/${newActivity.id}`)
                })
        }
        else {
            editActivity(activity)
                .then(() => {
                    history.push(`/activities/${activity.id}`)
                })
        }
    }

    const handleInputChange = (evt: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = evt.currentTarget;
        setActivity({ ...activity, [name]: value })
    }

    return (
        <Grid>
            <Grid.Column width={10}>
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
                        <Button
                            onClick={() => history.push('/activities')}
                            floated='right'
                            type='button'
                            content='Cancel' />
                    </Form>
                </Segment>
            </Grid.Column>
        </Grid>


    )
}

export default observer(ActivityForm);
