import { observer } from 'mobx-react-lite';
import React, { FormEvent, TextareaHTMLAttributes, useContext, useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom';
import { Button, Form, Grid, Segment } from 'semantic-ui-react'
import { Form as FinalForm, Field } from 'react-final-form'


import { IActivity } from '../../../app/models/activities'
import ActivityStore from "../../../app/stores/activityStore";
import TextInput from '../../../app/common/form/TextInput';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import SelectInput from '../../../app/common/form/SelectInput';
import { category } from '../../../app/common/options/categoryOptions';

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

    //const handleSubmit = () => {
    // if (activity.id.length === 0) {
    //     let newActivity = {
    //         ...activity,
    //         id: uuid()
    //     }
    //     createActivity(newActivity)
    //         .then(() => {
    //             history.push(`/activities/${newActivity.id}`)
    //         })
    // }
    // else {
    //     editActivity(activity)
    //         .then(() => {
    //             history.push(`/activities/${activity.id}`)
    //         })
    // }
    //

    const handleFinalFormSubmit = (values: any) => {
        console.log(values)
    }

    return (
        <Grid>
            <Grid.Column width={10}>
                <Segment clearing>
                    <FinalForm
                        onSubmit={handleFinalFormSubmit}
                        render={({ handleSubmit }) => (
                            <Form onSubmit={handleSubmit}>
                                <Field
                                    name='title'
                                    placeholder='Title'
                                    value={activity.title}
                                    component={TextInput}
                                />
                                <Field
                                    name='description'
                                    rows={3}
                                    placeholder='Description'
                                    value={activity.description}
                                    component={TextAreaInput}
                                />
                                <Field
                                    name='category'
                                    placeholder='Category'
                                    value={activity.category}
                                    component={SelectInput}
                                    options={category}
                                />
                                <Field
                                    name='date'
                                    placeholder='Date'
                                    value={activity.date}
                                    component={TextInput}
                                />
                                <Field
                                    name='city'
                                    placeholder='City'
                                    value={activity.city}
                                    component={TextInput}
                                />
                                <Field
                                    name='venue'
                                    placeholder='Venue'
                                    value={activity.venue}
                                    component={TextInput}
                                />
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
                        )}
                    />
                </Segment>
            </Grid.Column>
        </Grid>


    )
}

export default observer(ActivityForm);
