import type { FunctionComponent } from 'react'
import PageHeader from 'signals/settings/components/PageHeader'
import { NavLink } from 'react-router-dom'
import { Card, CardContent, Paragraph } from '@amsterdam/asc-ui'

type Keys = 'departments' | 'groups' | 'settings' | 'users' | 'categories'

interface Props {
  showItems: Record<Keys, boolean | undefined>
}

const Overview: FunctionComponent<Props> = ({ showItems }) => {
  if (!showItems.settings) {
    return null
  }

  return (
    <>
      <PageHeader title="Instellingen" />
      {showItems.users && (
        <NavLink to="/instellingen/gebruikers">
          <Card maxWidth={250} backgroundColor="level2" shadow>
            <CardContent>
              <Paragraph>Gebruikers</Paragraph>
            </CardContent>
          </Card>
        </NavLink>
      )}
      {showItems.groups && (
        <NavLink to="/instellingen/rollen">
          <Card maxWidth={250} backgroundColor="level2" shadow>
            <CardContent>
              <Paragraph>Rollen</Paragraph>
            </CardContent>
          </Card>
        </NavLink>
      )}
      {showItems.departments && (
        <NavLink to="/instellingen/afdelingen">
          <Card maxWidth={250} backgroundColor="level2" shadow>
            <CardContent>
              <Paragraph>Afdelingen</Paragraph>
            </CardContent>
          </Card>
        </NavLink>
      )}
      {showItems.categories && (
        <NavLink to="/instellingen/categorieen">
          <Card maxWidth={250} backgroundColor="level2" shadow>
            <CardContent>
              <Paragraph>Subcategorieën</Paragraph>
            </CardContent>
          </Card>
        </NavLink>
      )}
    </>
  )
}

export default Overview
