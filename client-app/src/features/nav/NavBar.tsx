import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Container, Button } from 'semantic-ui-react';

export const NavBar: React.FC = () => {
  return (
    <Menu inverted fixed='top'>
      <Container>
        <Menu.Item header as={NavLink} exact to='/'>
          <img
            src="assets/logo.png"
            alt="logo"
            style={{ marginRight: 10 }} />
            Reactivities
        </Menu.Item>
        <Menu.Item name='Activities' as={NavLink} to='/activities' />
        <Menu.Item>
          <Button
            as={NavLink} to='/createActivity'
            positive
            content="Create activity"></Button>
        </Menu.Item>
      </Container>
    </Menu>
  )
}