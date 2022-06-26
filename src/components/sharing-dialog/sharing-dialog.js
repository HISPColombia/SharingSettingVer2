import { useAlert, useDataQuery, useDataMutation } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import {
    ACCESS_NONE,
    ACCESS_VIEW_ONLY,
    ACCESS_VIEW_AND_EDIT,
    VISUALIZATION,
    DASHBOARD,
    EVENT_VISUALIZATION,
    INTERPRETATION,
} from './constants.js'
import { FetchingContext } from './fetching-context/index.js'
import {
    convertAccessToConstant,
    replaceAccessWithConstant,
    createOnChangePayload,
    createOnAddPayload,
    createOnRemovePayload,
} from './helpers/index.js'
import { Modal } from './modal/index.js'
import { TabbedContent } from './tabs/index.js'

const query = {
    sharing: {
        resource: 'sharing',
        params: ({ type, id }) => ({
            type,
            id,
        }),
    },
}
const queryUsers = {
    sharing: {
        resource: 'users',
        params: {
            fields: ['id', 'displayName','name'],
        }
    },
}
const queryUserGroups = {
    sharing: {
        resource: 'userGroups',
        params: {
            fields: ['id', 'displayName','name'],
        }
    },
}
const mutation = {
    resource: 'sharing',
    params: ({ type, id }) => ({
        type,
        id,
    }),
    type: 'create',
    data: ({ data }) => data,
}



export const SharingDialog = ({
    id,
    type,
    onClose,
    onError,
    onSave,
    initialSharingSettings,
    modal
}) => {
    const { show: showError } = useAlert((error) => error, { critical: true })

    /**
     * Data fetching usergroups and user
     */

 const { dataUsers, refetchUsers, loadingUsers, fetchingUsers } = useDataQuery(queryUsers, {
    variables: { id, type },
    onError: (error) => {
        showError(error)
        onError(error)
    },
})

const { dataUsersGroups, refetchUserGroups, loadingUserGroups, fetchingUserGroups } = useDataQuery(queryUserGroups, {
    variables: { id, type },
    onError: (error) => {
        showError(error)
        onError(error)
    },
})


    /**
     * Data fetching
     */

    const { data, refetch, loading, fetching } = useDataQuery(query, {
        variables: { id, type },
        onError: (error) => {
            showError(error)
            onError(error)
        },
    })

    const [mutate, { loading: mutating }] = useDataMutation(mutation, {
        variables: {
            type,
            id,
        },
        onError: (error) => {
            showError(error)
            onError(error)
            refetch()
        },
        onComplete: () => {
            refetch()
            onSave()
        },
    })


    /**
     * Refresh data when type or id props change
     */

    useEffect(() => {
        refetch({ type, id })
    }, [type, id])

    /**
     * Block interaction during the initial load
     */

    if (loading) {
        const users = Object.keys(initialSharingSettings.users).map(
            replaceAccessWithConstant
        )
        const groups = Object.keys(initialSharingSettings.groups).map(
            replaceAccessWithConstant
        )
        let SharingSettingsComponent=<TabbedContent
        id={id}
        users={users}
        groups={groups}
        publicAccess={initialSharingSettings.public}
        allowPublicAccess={initialSharingSettings.allowPublic}
        type={type}
        onAdd={() => {}}
        onChange={() => {}}
        onRemove={() => {}}
    />
        if(modal===true)
            return (
                <FetchingContext.Provider value={true}>
                    <Modal onClose={onClose}>{SharingSettingsComponent}</Modal>
                </FetchingContext.Provider>
            )
        else
            return (
                <FetchingContext.Provider value={true}>
                    {SharingSettingsComponent}
                </FetchingContext.Provider>
            )   

    }

    const { object, meta } = data.sharing
    const publicAccess = convertAccessToConstant(object.publicAccess)
    const users = object.userAccesses.map(replaceAccessWithConstant)
    const groups = object.userGroupAccesses.map(replaceAccessWithConstant)

    /**
     * Handlers
     */

    const onAdd = ({ type: newType, id: newId, access, name }) => {
        
        const data = createOnAddPayload({
            object,
            type: newType,
            access,
            id: newId,
            name,
        });
        console.log({ data,type: newType, id: newId, access, name })
        //mutate({ data, type, id })
    }

    const onChange = ({ type: changedType, id: changedId, access }) => {
        const data = createOnChangePayload({
            object,
            type: changedType,
            access,
            id: changedId,
        })
        //mutate({ data, type, id })
    }

    const onRemove = ({ type: removedType, id: removedId }) => {
        const data = createOnRemovePayload({
            object,
            type: removedType,
            id: removedId,
        })
        //mutate({ data, type, id })
    }
    let SharingSettingsComponent=<TabbedContent
    id={id}
    users={users}
    groups={groups}
    publicAccess={publicAccess}
    allowPublicAccess={meta.allowPublicAccess}
    type={type}
    onAdd={onAdd}
    onChange={onChange}
    onRemove={onRemove}
/>
    if(modal===true)
        return (
            <FetchingContext.Provider value={mutating || fetching}>
                <Modal onClose={onClose} name={object.displayName || object.name}>{SharingSettingsComponent}</Modal>
            </FetchingContext.Provider>
        )
    else
        return (
            <FetchingContext.Provider value={mutating || fetching}>
                {SharingSettingsComponent}
            </FetchingContext.Provider>
        )
}

SharingDialog.defaultProps = {
    initialSharingSettings: {
        name: '',
        allowPublic: true,
        public: ACCESS_NONE,
        groups: {},
        users: {},
    },
    onClose: () => {},
    onError: () => {},
    onSave: () => {},
}

SharingDialog.propTypes = {
    /** The id of the object to share */
    id: PropTypes.string.isRequired,
    /** The type of object to share */
    type: PropTypes.oneOf([
        VISUALIZATION,
        DASHBOARD,
        EVENT_VISUALIZATION,
        INTERPRETATION,
    ]).isRequired,
    /** Used to seed the component with data to show whilst loading */
    initialSharingSettings: PropTypes.shape({
        allowPublic: PropTypes.bool.isRequired,
        groups: PropTypes.objectOf(
            PropTypes.shape({
                access: PropTypes.string.isRequired,
                id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
            })
        ),
        name: PropTypes.string,
        public: PropTypes.oneOf([
            ACCESS_NONE,
            ACCESS_VIEW_ONLY,
            ACCESS_VIEW_AND_EDIT,
        ]),
        users: PropTypes.objectOf(
            PropTypes.shape({
                access: PropTypes.string.isRequired,
                id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
            })
        ),
    }),
    onClose: PropTypes.func,
    onError: PropTypes.func,
    onSave: PropTypes.func,
}
