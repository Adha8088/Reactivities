import { observer } from 'mobx-react-lite'
import React, { Fragment, useContext } from 'react'
import { Item, Label } from 'semantic-ui-react'
import ActivityStore from "../../../app/stores/activityStore";
import ActivityListItem from './ActivityListItem';

const ActivityList: React.FC = () => {
    const {
        activitiesByDate,
    } = useContext(ActivityStore);
    return (
        <Fragment>
            {activitiesByDate.map(([group, activities]) => (
                <Fragment key={group}>
                    <Label size='large' color='blue'>
                        {group}
                    </Label>
                    <Item.Group divided>
                        {
                            activities.map(a => (
                                <ActivityListItem key={a.id} activity={a} />
                            ))
                        }
                    </Item.Group>
                </Fragment>
            ))}
        </Fragment>
    )
}


export default observer(ActivityList);