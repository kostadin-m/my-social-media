// types
import { UserDocument } from "@types";

//custom hooks
import { useAuthContext, useFirestore } from "@hooks";

//components
import { Button } from "@features/ui";
import ModalWrapper from "../modal-wrapper";



//styles
import styles from "./friends-action-modal.module.css";
import { removeFriend } from "@features/friends";

interface Props {
    setActionModal: React.Dispatch<React.SetStateAction<boolean>>
    theme: string
    friend: UserDocument
}

export default function FriendsActionModal({ setActionModal, theme, friend }: Props) {
    const { updateDocument, response } = useFirestore<UserDocument>('users')
    const { user } = useAuthContext()

    const closeModal = () => setActionModal(false);

    const submit = async () => {
        await removeFriend({ user, friend, updateDocument })

        if (response.error) return
        closeModal()

    }

    return (
        <ModalWrapper title={`Are you sure you want to remove ${friend.displayName} from your friends list?`}
            theme={theme}
            setViewModal={setActionModal}>

            {response.isPending && <div className='spinner'></div>}
            <p className={`${styles.warning} ${styles[theme]}`}>
                If you remove your friend you can add them again!
            </p>
            <div className={styles.buttonsContainer}>
                <Button text={response.isPending ? 'Loading...' : 'Remove friend'}
                    disabled={response.isPending} theme={theme} onClick={() => submit()} />

                <Button disabled={false} text="No" theme={theme} onClick={() => closeModal()} />
            </div>
        </ModalWrapper>
    );
}
