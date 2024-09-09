import { getCollection } from "astro:content";
import { Clients, Posts, db } from "astro:db";

// https://astro.build/db/seed
export default async function seed() {
  // TODO

  await db.insert(Clients).values([
    { id: 1, name: "Rodwin", age: 38, isActive: true },
    { id: 2, name: "Laura", age: 34, isActive: true },
    { id: 3, name: "Maximo", age: 7, isActive: true },
    { id: 4, name: "Lucio", age: 2, isActive: true },
    { id: 5, name: "Lucy", age: 65, isActive: true },
    { id: 6, name: "luca", age: 1, isActive: false },
  ]);


  // demostracion de insercion de blogs a la base de datos localStorage, no se necesita para produccion solo es un ejemplo
  const posts = await getCollection('blog');

  await db.insert(Posts).values(
    posts.map((p) => ({
      id: p.id,
      title: p.data.title,
      likes: Math.round(Math.random() * 100),

    }))
  )


  console.log("Seed executed");
}
