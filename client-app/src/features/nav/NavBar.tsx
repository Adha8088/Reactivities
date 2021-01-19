import React, { useContext } from 'react';
import { Menu, Container, Button } from 'semantic-ui-react';

import ActivityStore from "../../app/stores/activityStore";

export const NavBar: React.FC = () => {
  const { openCreateForm } = useContext(ActivityStore)
  return (
    <Menu inverted fixed='top'>
      <Container>
        <Menu.Item header>
          <img src="assets/logo.png" alt="logo" style={{ marginRight: 10 }} />
          Reactivities
          </Menu.Item>
        <Menu.Item>
          <Button onClick={() => openCreateForm()} positive content="Create activity"></Button>
        </Menu.Item>
      </Container>
    </Menu>
  )
}