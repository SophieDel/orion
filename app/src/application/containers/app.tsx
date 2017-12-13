import {
    Button,
    Spinner,
} from '@blueprintjs/core'
import * as _ from 'lodash'
import * as React from 'react'
import {Route} from 'react-router'
import {BrowserRouter} from 'react-router-dom'
import {connect} from 'react-redux'

import {
    appState,
} from '../types'
import * as actions from '../actions'

import {NavPanel} from '../components/utils/navPanel'
import {NavBar} from '../components/utils/navBar'
import {ConceptsPresentation} from './conceptsPresentation'

const mapReduxStateToReactProps = (state : appState): appState => {
    return state
}

function reduxify(mapReduxStateToReactProps: any, mapDispatchToProps?: any, mergeProps?: any, options?: any) {
    return (target: any) => (connect(mapReduxStateToReactProps, mapDispatchToProps, mergeProps, options)(target) as any)
}

@reduxify(mapReduxStateToReactProps)
export class App extends React.Component<appState, any> {
    constructor(props: appState) {
        super(props)
    }

    sendFetchAction (slug?: string) {
        this.props.dispatch(actions.fetchConcept('concepts/' + slug, 'cp1'))
    }

    // When page is done loading, fetch concept graph from backend
    componentDidMount() {
        this.props.dispatch(actions.fetchConceptGraph('concepts/', 'app'))
        // this.props.dispatch(actions.fetchConcept('concepts/chomage/', 'cp1'))
    }

    render () {
        let {conceptGraph} = this.props

        let loading = false

        let spinner = loading ?
            <span className={'vertical-center'}>
                <Spinner className={'pt-small'}/>
                <span className={'pt-navbar-divider'}></span>
            </span> : null

        const navbar_button = (
            <div className={'vertical-center'}>
                {spinner}
                <Button
                    className={'pt-minimal'}
                    onClick={() => this.sendFetchAction('chomage')}
                    text={'Send Fetch Request'}
                />
            </div>
        )

        const classToggled = (this.props.toggled) ? ' toggled' : ''

        return (
            <div>
                <NavBar
                    // right_text={navbar_button}
                    left_text={'Visualisation et documentation de données socio-économiques'}
                />

                <div id={'app-container'}>
                    <div
                        id={'concept-nav-panel'}
                        className={classToggled}
                    >
                        <NavPanel
                            nodes={conceptGraph.nodes}
                            graph={conceptGraph.graph}
                            graphNodes={conceptGraph.graphNodes}
                            selectedRoot={conceptGraph.selectedRoot}
                            selectedNode={conceptGraph.selectedNode}
                            dispatch={this.props.dispatch}
                            toggled={this.props.toggled}
                            displayedNode={conceptGraph.displayedNode}
                            displayedSlugs={conceptGraph.displayedSlugs}
                        />
                    </div>
                    <div className={'left-of-panel' + classToggled}>
                        <BrowserRouter>
                            <Route path='/' exact={true} render={routeProps => <ConceptsPresentation containerId={'cp1'} loading={0} />} />
                        </BrowserRouter>
                    </div>
                </div>
            </div>
        )
    }
}
