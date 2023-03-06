import React, { useState } from 'react';
import PlacesAutocomplete, { Suggestion } from 'react-places-autocomplete';

//icons
import { LocationIcon } from '@assets'

//styles
import styles from './location-modal.module.css'
import WithAutoComplete from '@features/ui/modals/location-modal/hocs/with-autocomplete';

interface Props {
    handleLocationSelect: (location: string) => void
    theme: string
}


export default function LocationSearch({ handleLocationSelect, theme }: Props) {
    const [adress, setAdress] = useState('')
    const [locations, setLocations] = useState<readonly Suggestion[]>([])

    return (
        <div>
            <PlacesAutocomplete value={adress} onChange={setAdress} onSelect={(value: string) => handleLocationSelect(value)}>
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <WithAutoComplete
                        adress={adress}
                        suggestions={suggestions}
                        loading={loading}
                        setLocations={setLocations}>
                        <div className={`${styles.search} ${styles[theme]}`}>
                            <input
                                {...getInputProps({
                                    placeholder: 'Search Places ...'
                                })} />
                            {loading && <div className={styles.loading}>Loading...</div>}
                            {!loading && locations.length > 0 ?
                                <div className={styles.dataResult}>
                                    {locations.map(suggestion => (
                                        <div {...getSuggestionItemProps(suggestion)}
                                            key={suggestion.index}
                                            className={`${styles.dataItem} ${styles[theme]}`}>
                                            <div>
                                                <img src={LocationIcon} alt='location img'></img>
                                                <span>{suggestion.description}</span>
                                            </div>
                                        </div>))}
                                </div> : <div className={styles.dataResult}></div>}
                        </div>
                    </WithAutoComplete>)}
            </PlacesAutocomplete >
        </div>
    )
}