import React, {useContext} from 'react'
import AuthContext from '../context/AuthContext'

const Login = () => {

    let {loginUser} = useContext(AuthContext)
    return (
        <>
            <div className='container my-5'>
                <form onSubmit={loginUser}>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                        <input type="email" className="form-control" name='email' required/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                        <input type="password" className="form-control" name='password' required/>
                    </div>
                    <button type="submit" className="btn btn-dark">Submit</button>
                </form>
            </div>
        </>
    )
}

export default Login