import { Button } from "../ui/button"

const AddComment = () => {
  return (
    <section>
        <div>
            <h1>Add Comment</h1>
            <form>
                <label>Write a comment</label>
                <input type="text" />
                <Button>Post</Button>
            </form>
        </div>
    </section>
  )
}

export default AddComment