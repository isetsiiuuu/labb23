import Link from "next/link";


const index = () => {
    return (
        <div className="wrapperWelcome">
            <h1>Welcome!</h1>
           
            <span className="textHome">Do you want to create an account?</span>
            <br />
            <br />
            <Link href={"/register?type=user"}>
                <button className="formBtn">Create Account</button>
            </Link>
            <Link href={"/register?type=admin"}>
                <button className="formBtn">Create Account (Admin)</button>
            </Link>
            <Link href={"/login"}>
                <button className="formBtn">Login</button>
            </Link>
        </div>
    );
}

export default index;