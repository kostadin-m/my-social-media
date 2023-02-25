import { memo, useState } from 'react'

//styles
import styles from '../Post.module.css'

//types
import { PostDocument } from '@types'


import { timeStamp } from '../../../firebase/config'

//components
import Button from '@ui/Button'
import TextArea from '@ui/TextArea'
import CommentContent from './CommentContent'
import { useAuthContext, useFirestore } from '@hooks'

interface Props {
    theme: string
    classname: string
    post: PostDocument
}

function Comments({ theme, classname, post }: Props) {
    const [comment, setComment] = useState('')

    const { user } = useAuthContext()
    const { updateDocument, response } = useFirestore('posts')

    const handleAddComment = async () => {
        if (!comment) {
            return
        }
        const commentsObject = { commentContent: comment, creatorID: user?.id, createdAt: timeStamp.fromDate(new Date()) }
        const updatedComments = { comments: [...post.comments, commentsObject] } as PostDocument

        await updateDocument(post.id, updatedComments)

        setComment('')
    }


    return (
        <div data-testid='comments' className={`${styles.commentsContainer} ${styles[classname]}`}>
            <hr className={`${styles.commentsHr} ${styles[theme]}`} />
            <h2>Comments</h2>
            <hr className={`${styles.commentsHr} ${styles[theme]}`} />
            <div className={styles.comments}>
                {post.comments.length > 0 && post.comments.map(comment => (<CommentContent key={Math.random()} comment={comment} theme={theme} />))}
            </div>

            <hr className={`${styles.commentsHr} ${styles[theme]}`} />
            <div className={`${styles.inputContainer} ${styles[theme]}`}>

                {response.error && <p className='error'>{response.error}</p>}

                <img className='profile-image' src={user?.photoURL} alt='current-user-icon' />
                <TextArea value={comment} setValue={setComment} placeholder='Write a comment' theme={theme} />
                <Button
                    disabled={response.isPending}
                    theme={theme}
                    onClick={() => handleAddComment()}
                    text={response.isPending ? 'Loading...' : "Post a comment"} />
            </div>
        </div>
    )
}


export default memo(Comments)