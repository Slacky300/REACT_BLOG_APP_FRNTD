import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Loading from '../components/Loading';
import AuthContext from '../context/AuthContext';

export const BlogDetail = () => {


    const { slug } = useParams();
    let [postData, setPostData] = useState({});
    let {user, msgType} = useContext(AuthContext);
    let [loading, setLoading] = useState(false);
    let [comments, setComments] = useState([]);
    useEffect(() => {

        async function getPostData() {
            try {

                setLoading(true);
                let url = `${process.env.REACT_APP_SERVER_URL}/api/posts/${slug}/`;
                let res = await fetch(url, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                let data = await res.json();
                setPostData(data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        async function getComments() {
            try {
                setLoading(true);
                let url = `${process.env.REACT_APP_SERVER_URL}/api/comments/${slug}/`;
                let res = await fetch(url, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })

                let data = await res.json();
                setComments(data)

            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        getPostData();
        getComments();

    }, [slug]);


    async function Comment(e){
        try{
            setLoading(true);
            e.preventDefault();
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();

            const withSlashes = [day, month, year].join('-');
            let url = `${process.env.REACT_APP_SERVER_URL}/api/comments/${slug}/`;
            let res = await fetch(url,{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
            
                },
                body: JSON.stringify({
                    "post": postData.id,
                    "byUser": user.user_id,
                    "text": e.target.cmntText.value,
                    "cmntDate": withSlashes,
                    "likes": []
                })
            })

            let data = await res.json();
            if (res.status === 201) {
                return (msgType("success", `Commented successfully`));
            } else {

                return msgType("warning", data.detail);
            }

        }catch(error){
            console.log(error);
        }finally{
            setLoading(false);
        }
    }



    return (
        <>
            {!loading ? (
                <>
                    <div className='row px-4 py-4'>
                        <div className='col-lg-6  py-4 px-4  d-flex justify-content-center align-items-center'>
                            <img className='image-fluid img-thumbnail' src={`${process.env.REACT_APP_SERVER_URL}/${postData.img}/`} alt='imagesI' />
                        </div>

                        <div className='col-lg-6 py-4 px-4'>
                            <h1>{postData.title}</h1>
                            <p> {postData.desc} </p>
                        </div>

                    </div>
                    <hr />
                    <div className='row px-4 py-3'>
                        <h2 className='pb-4'>Comments ({comments.length})</h2>
                        <div className="card shadow-0 border bg-dark" >
                            <div className="card-body p-4 bg-dark">
                                <form onSubmit={Comment}>
                                    <div className="form-outline mb-4">
                                        <input type="text" id="addANote" name='cmntText' className="form-control" placeholder="Type comment..." />
                                    </div>
                                    <button type='submit' className='btn btn-light'>Submit</button>
                                </form>
                                
                                {comments.map((item) => {
                                    return (<div className="card mb-4" key = {item.id}>
                                        <div className="card-body bg-dark" style={{ color: "#fff" }}>
                                            <p>{item.text}</p>

                                            <div className="d-flex justify-content-between">
                                                <div className="d-flex flex-row align-items-center">
                                                    <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(4).webp" alt="avatar" width="25"
                                                        height="25" style={{ borderRadius: "50%" }} />
                                                    <p className="small mb-0 ms-2">Hello</p>
                                                </div>
                                                <div className="d-flex flex-row align-items-center text-light">
                                                    <p className="small mb-0 text-light" >Upvote?</p>
                                                    <i className="far fa-thumbs-up mx-2 fa-xs text-light" style={{ marginTtop: "-0.16rem" }}></i>
                                                    <p className="small mb-0 text-light">{item.likes && item.likes.length}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>)

                                })}



                            </div>
                        </div>


                    </div>

                </>

            ) : (
                <Loading />
            )}

        </>
    )
}
