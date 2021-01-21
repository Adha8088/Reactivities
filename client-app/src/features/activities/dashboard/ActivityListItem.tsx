import React from 'react'
import { Link } from 'react-router-dom';
import { Item, Button, Segment, SegmentGroup, Icon, ItemGroup } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activities';

const ActivityListItem: React.FC<{ activity: IActivity }> = ({
    activity
}) => {

    return (
        <SegmentGroup>
            <Segment>
                <ItemGroup>
                    <Item>
                        <Item.Image size='tiny' circular src='assets/user.png'>
                        </Item.Image>
                        <Item.Content>
                            <Item.Header as='a'>{activity.title}</Item.Header>
                        </Item.Content>
                    </Item>
                </ItemGroup>
            </Segment>
            <Segment>
                <Icon name='clock' /> {activity.date}
                <Icon name='marker' /> {activity.venue}, {activity.city}
            </Segment>
            <Segment secondary>
                Attendees here
            </Segment>
            <Segment clearing>
                <span>{activity.description}</span>
                <Button
                    as={Link} to={`/activities/${activity.id}`}
                    floated='right'
                    content='View'
                    color='blue'
                />
            </Segment>
        </SegmentGroup>
    )
}

export default ActivityListItem;
