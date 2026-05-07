import { createClient }
    from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
let cards = document.querySelector(".cards");

function createCard(title, content, likes, id) {
    let card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
    <h2>${title}</h2>
    <p>${content}</p>
    <button  class="but">❤️ <b>${likes}</b></button>
    `;
    let button = card.querySelector(".but");
    let isliked = false;
    button.addEventListener("click", () => {
        if (!isliked) {
            isliked = true;
            button.style.backgroundColor = "pink";
            let like = button.querySelector('b').innerText;
            button.querySelector('b').innerText = Number(like) + 1;
            dolike(id, Number(like) + 1);
            // console.log(button.innerText);

        } else {
            isliked = false;
            button.style.backgroundColor = "";
            let like = button.querySelector('b').innerText;
            button.querySelector('b').innerText = Number(like) - 1;
            dolike(id, Number(like) - 1);

        }

    })
    return card;
}

const supabaseUrl = 'https://jbvuntnpqxbppktthupy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpidnVudG5wcXhicHBrdHRodXB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MjI0NzcsImV4cCI6MjA5MjE5ODQ3N30.kQAOHQNUK8rQCvogh5YnqyjjisxXr8jaZSAAthlhaOM'

const supabase = createClient(
    supabaseUrl,
    supabaseKey
)


async function fetchdata() {
    let { data, error } =
        await supabase
            .from("blogs")
            .select("*").order("id", {
                ascending: false
            });;
    data.forEach(item => {
        cards.appendChild(
            createCard(item.title, item.content, item.likes, item.id)
        );
    });
}
fetchdata();


let popup = document.querySelector(".popup");
function showPopup() {
    popup.style.display = "";
}


let newblogbut = document.querySelector(".new button");
newblogbut.addEventListener("click", () => {
    showPopup();
})



async function dolike(id, like) {
    let { data, error } =
        await supabase
            .from("blogs")
            .update({
                likes: like
            })
            .eq("id", id);

    if (error) {
        console.log(error);
    }
}


let search = document.querySelector("#search");
search.addEventListener("input", () => {
    let items = cards.querySelectorAll(".card");
    let text = search.value.toLowerCase();
    items.forEach(card => {
        let value = card.querySelector("h2").innerText.toLowerCase();
        if (value.includes(text)) {

            card.style.display = '';
        } else {
            card.style.display = "none";
        }
    })
})

let tit = document.querySelector(".popup").querySelector(".title");
let cont = document.querySelector(".popup").querySelector(".content");

let close = document.querySelector("#close");
close.addEventListener("click", () => {
    popup.style.display = "none";
    if(tit.value != "" && cont.value != ""){
    newblog(tit.value,cont.value);
    let card = createCard(tit.value,cont.value,0,0);
    cards.prepend(card);
    }

});


async function newblog(title, content) {
        await supabase
            .from("blogs")
            .insert({
                "title":title,
                "content":content
            })
}