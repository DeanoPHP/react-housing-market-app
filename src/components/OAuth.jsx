import { useLocation, useNavigate } from "react-router-dom"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase.config"
import { toast } from "react-toastify"
import googleIcon from "../assets/svg/googleIcon.svg"

function OAuth() {
    const location = useLocation()
    const navigate = useNavigate()

    const onGoogleClick = async () => {
        try {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            const user = result.user

            // Check for user 
            // Takes in a reference to a document and returns a DocumentSnapshot that offers the data in the document
            const userRef = doc(db, "users", user.uid)
            const userSnap = await getDoc(userRef)

            // If user doesnt exist in firestore, create one
            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    name: user.displayName,
                    email: user.email,
                    timeStamp: serverTimestamp(),
                })
            }
            toast.success(`Welcome ${user.displayName}!`)
            navigate("/")
        } catch (error) {
            toast.error('Could not sign in with Google')
        }
    }

  return (
    <div className="socialLogin">
        <p>Sign {location.pathname === '/sign-up' ? 'Up' : 'In'} With </p>
        <button className="socialIconDiv" onClick={onGoogleClick}>
            <img className="socialIconImg" src={googleIcon} alt="google" />
        </button>
    </div>
  )
}

export default OAuth
