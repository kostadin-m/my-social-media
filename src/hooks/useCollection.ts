import { useReducer, useEffect, useRef } from "react"
import { db } from "../firebase/config"
import { collection, onSnapshot, query, orderBy, where, Query } from "firebase/firestore"

import { ICollectionState, ICollectionAction, CollectionType } from "../types"

const initialState = { document: null, error: null, isPending: false }

const collectionReducer = <T extends CollectionType>(state: ICollectionState<T>, action: ICollectionAction<T>) => {
    switch (action.type) {
        case "IS_PENDING":
            return { document: null, error: null, isPending: true }
        case "ADD_DOCUMENTS":
            return { document: action.payload, error: null, isPending: false }
        case "ERROR":
            return { document: null, error: action.payload, isPending: false }
        default:
            return state
    }
}

export const useCollection = <T extends CollectionType>(_collection: string): ICollectionState<T> => {
    const [state, dispatch] = useReducer
        <React.Reducer<ICollectionState<T>, ICollectionAction<T>>>
        (collectionReducer, initialState)

    const col = useRef(_collection).current

    useEffect(() => {
        let ref: Query = collection(db, _collection)

        const unsub = onSnapshot(ref, (snapshot) => {
            dispatch({ type: "IS_PENDING" })
            //Get The Data from the Collection
            let data: T[] = []
            snapshot.docs.forEach(doc => {
                const id = doc.id
                data.push({ ...doc.data(), id } as T)
            })

            //update state
            dispatch({ type: 'ADD_DOCUMENTS', payload: data })

        }, (error) => {

            dispatch({ type: "ERROR", payload: error.message })

        })

        return () => unsub()
    }, [col])
    return { ...state }
}
