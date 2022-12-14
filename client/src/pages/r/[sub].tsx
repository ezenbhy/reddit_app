import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Axios  from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthState } from '../../context/auth';
import axios from 'axios'

import SideBar from '../../components/SideBar';

import PostCard from '../../components/PostCard';
import { Post } from '../../types';

const SubPage = () => {
   
    // const fetcher =async (url:string) => {
    //     try {
    //         const res = await Axios.get(url);
    //         return res.data;
    //     } catch (err) {
    //         throw err.response.data;
    //     }
    // }
   

    
    const router = useRouter();
    const subName = router.query.sub;
    const { data: sub, error, mutate } = useSWR(subName ? `/subs/${subName}` : null);  
    console.log("sub",sub);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [ownSub, setOwnSub] = useState(false);
    const { authenticated, user } = useAuthState();

    useEffect(() => {
        if (!sub || !user) return;
        setOwnSub(authenticated && user.username === sub.username);
    }, [sub]);

    console.log('sub', sub);
    const openFileInput = (type: string) => {

        const fileInput = fileInputRef.current;
        if (fileInput) {
            fileInput.name = type;
            fileInput.click(); //fileInputRef.current.click()
        }
    }
    const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files === null) return;

        const file = event.target.files[0];
        console.log('file', file);

        const formData = new FormData();// 새로운 폼 객체 생성
        formData.append("file", file);// 서버에서 file 라는 키에 파일을 담기
        formData.append("type", fileInputRef.current!.name);

        try {
            await axios.post(`/subs/${sub.name}/upload`, formData, {
                headers: { "Context-Type": "multipart/form-data" }
            });
        } catch (error) {
            console.log(error);
        }
    }
    let renderPosts;
    if (!sub) {
        renderPosts = <p className="text-lg text-center">로딩중...</p>
    } else if (sub.posts.length === 0) {
        renderPosts = <p className="text-lg text-center">아직 작성된 포스트가 없습니다.</p>
    } else {
        renderPosts = sub.posts.map((post: Post) => (
            <PostCard key={post.identifier} post={post} subMutate={mutate} />
        ))
    }
    console.log('sub.imageUrl', sub?.imageUrl)
    return (
    <>
    {sub &&
            <>
                <div>
                <input type="file" hidden={true} ref={fileInputRef} onChange={uploadImage} />
                    {/* 배너 이미지 */}
                    <div className="bg-gray-400">
                        {sub.bannerUrl ? (
                            <div
                                className='h-56'
                                style={{
                                    backgroundImage: `url(${sub.bannerUrl})`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                                onClick={() => openFileInput("banner")}
                            >
                            </div>
                        ) : (
                            <div className='h-20 bg-gray-400'
                                onClick={() => openFileInput("banner")}
                            ></div>
                        )}
                    </div>
                    {/* 커뮤니티 메타 데이터 */}
                    <div className='h-20 bg-white'>
                        <div className='relative flex max-w-5xl px-5 mx-auto'>
                            <div className='absolute' style={{ top: -15 }}>
                                {sub.imageUrl && (
                                    <Image
                                        src={sub.imageUrl}
                                        alt="커뮤니티 이미지"
                                        width={70}
                                        height={70}
                                        className="rounded-full"
                                        onClick={() => openFileInput("image")}
                                    />
                                )}
                            </div>
                            <div className='pt-1 pl-24'>
                                <div className='flex items-center'>
                                    <h1 className='text-3xl font-bold '>{sub.title}</h1>
                                </div>
                                <p className='font-bold text-gray-400 text-small'>
                                    /r/{sub.name}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 포스트와 사이드바 */}
                <div className='flex max-w-5xl px-4 pt-5 mx-auto'>
                    <div className="w-full md:mr-3 md:w-8/12">{renderPosts} </div>
                    <SideBar sub={sub} />
                </div>
            </>
        }
    </>
  )
}

export default SubPage