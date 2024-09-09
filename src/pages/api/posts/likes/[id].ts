
import type { APIRoute } from "astro";
import { db, eq, Posts } from "astro:db";

// generar del lado del servidor

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {

    const postid = params.id ?? '';

    // obtener cuantos likes desde db

    const posts = await db.select().from(Posts).where(eq(Posts.id, postid));

    // si existe el post
    if (posts.length === 0) {
        const post = {
            id: postid,
            title: 'Post Not Found',
            likes: 0
        }

        return new Response(JSON.stringify(post), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            }
        });

    }

    return new Response(JSON.stringify(posts.at(0)), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });


};

export const PUT: APIRoute = async ({ params, request }) => {

    const postId = params.id ?? '';


    // ACTUALIZAR  likes de post hacia db

    const posts = await db.select().from(Posts).where(eq(Posts.id, postId));
    const { likes = 0 } = await request.json();

    if (posts.length === 0) {
        const newPost = {
            id: postId,
            title: 'Post Not Found',
            likes: 0,
        };
        // insertamos en la base de datos:

        await db.insert(Posts).values(newPost);
        posts.push(newPost);

    }

    const post = posts.at(0)!;
    post.likes = post.likes + likes;

    await db.update(Posts).set(post).where(eq(Posts.id, postId));


    return new Response('OK', { status: 200 });
}