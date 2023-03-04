import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

//components
import { Friends } from "@features/friends"
import { UserWidget } from "@features/user"
import { Feed } from "@features/posts"


//custom hooks
import { useDocument } from "@hooks"

//types
import { UserDocument } from "@types"

//firebase
import { collection, documentId, onSnapshot, query, where } from "firebase/firestore"
import { db } from "../firebase/config"


export default function ProfilePage() {
    const { id } = useParams()
    const { document: user, error, isPending } = useDocument<UserDocument>('users', id!)
    const [friends, setFriends] = useState<UserDocument[]>([])

    useEffect(() => {
        if (!user || user.friends.length <= 0) return
        const ref = query(collection(db, 'users'), where(documentId(), 'in', user?.friends))
        const unsub = onSnapshot(ref, (snapshot) => {
            if (!snapshot) return

            const result = [] as UserDocument[]
            snapshot.docs.forEach((doc) => result.push({ ...doc.data(), id: doc.id } as UserDocument))

            setFriends(result)
        })
        return () => unsub()
    }, [user])

    return (
        <div className="page">
            {isPending && <div className="loader"></div>}
            {error && <div className="error">{error}</div>}
            <div className="profile-page-item">
                {user &&
                    <>
                        <UserWidget user={user} />
                        <Friends friends={friends} error={error} isPending={isPending} />
                    </>
                }
            </div>
            <div className="profile-page-item">
                <Feed id={id} />
            </div>

        </div >
    )
}
