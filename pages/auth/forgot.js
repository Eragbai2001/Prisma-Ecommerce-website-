import { Text, Card, Grid } from '@geist-ui/core'
import Layout from '../../components/Layout'

import { themePreference } from '../../state/Context'
import config from '../../main.config'

export default function Forgot() {
    const title = 'Forgot'
    const description = 'Forgot Sample Page'

    return (
        <Layout
            config={config}
            themePreference={themePreference}
            crownLarge={title}
            crownSmall={description}
            metaTitle={title}
        >
            <Grid.Container gap={1}>
                <Grid xs={24}>
                    <Card width="100%">
                        <Text>{description}</Text>
                    </Card>
                </Grid>
            </Grid.Container>
        </Layout>
    )
}
