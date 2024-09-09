<template>

<div v-if="likeIsLoading">
    Loading
</div>

<button v-else-if="likeCount === 0" @click="likePost">
    like this post
</button>

<button v-else @click="likePost">
    likes
    <span>{{ likeCount }}</span>
</button>


</template>


<!-- acaa va la parte de script de Vue -->

<script lang="ts" setup>
import { ref, watch } from 'vue';
import confetti from 'canvas-confetti';
import debounce from 'lodash.debounce';


interface Props {
    postId: string;
}

const props = defineProps<Props>();

const likeCount = ref(0);
const likeCliks = ref(0);
const likeIsLoading = ref(true);



watch(likeCount, debounce( ()=> {
    
    fetch(`/api/posts/likes/${props.postId}`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({likes: likeCliks.value})
    });

    likeCliks.value = 0;
}, 500))


const likePost =()=> {
    
    likeCount.value++
    likeCliks.value++

    confetti({
        particleCount: 200,
        spread: 70,
        origin: {
            x:Math.random(),
            y:Math.random() -0.2,
        }
    })
}


const getCurrentLikes = async() => {
    const resp = await fetch(`/api/posts/likes/${props.postId}`);
    if(!resp.ok) return;

    const data = await resp.json();
    
    likeCount.value = data.likes;
    likeIsLoading.value = false;

}

getCurrentLikes();
</script>

<style scoped>

button {
    background-color: #5e51bc;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
}

button:hover {
    background-color: #4a3f9a;
}
</style>