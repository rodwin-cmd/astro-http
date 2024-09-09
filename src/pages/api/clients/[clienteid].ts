import type { APIRoute } from "astro";
import { db, Clients, eq } from "astro:db";

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
  // VERIFICAR POR ID

  const clientId = params.clientId;

  const body = {
    method: "GET",
    clientId: clientId,
  };
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const PATCH: APIRoute = async ({ params, request }) => {
  const clientId = params.clientId ?? '';

  try {
    const { id, ...body } = await request.json();

    //update xxx=xxx from table
    const results = await db.update(Clients).set(body)
      .where(eq(Clients.id, +clientId))

    const updateClient = await db
      .select()
      .from(Clients)
      .where(eq(Clients.id, +clientId));

    return new Response(
      JSON.stringify(updateClient.at(0)),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      });

  } catch (error) {

    return new Response(JSON.stringify({ msg: 'No body found' }), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

export const DELETE: APIRoute = async ({ params, request }) => {

  const clientId = params.clientId ?? '';


  const { rowsAffected } = await db.delete(Clients).where(eq(Clients.id, +clientId))

  if (rowsAffected > 0) {
    return new Response(JSON.stringify({ msg: 'Deleted' }), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }


  return new Response(JSON.stringify({ msg: `Client with id ${clientId} not found` }), {
    status: 201,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
