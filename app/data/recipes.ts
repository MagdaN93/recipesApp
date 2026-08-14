import { Recipe } from "../types";

export const recipes:Recipe[] = [{
    id: "1",
    title: "Makaron z brokułem, groszkiem i mozzarellą",
    ingredients: [
        {name: "makaron", amount: "250g"},
        {name: "brokuł", amount: "1"}, 
        {name: "groszek", amount: "1 puszka"}, 
        {name: "mozarella", amount: "1 op"},
        {name: "oliwa", amount: "5 łyżek"}, 
        {name: "czosnek", amount: "3 ząbki"}
    ],
    steps: ["Ugotuj makaron i brokuł.", "Wymieszaj oliwę z czosnkiem i przyprawami.", "Ugotowany makaron i brokuł przełóż na talerz.", "Polej oliwą, posyp groszkiem i dodaj mozarrelę."],
    difficulty: "easy",
    prepTimeMinutes: 30,
    mealType: "dinner",
    servings: 2
},
{
    id: "2",
    title: "Ryż z groszkiem ",
    ingredients: [
        {name: "ryż", amount: "140g"},
        {name: "groszek", amount: "1 puszka"}, 
        {name: "koperek", amount: "50g"},
        {name: "oliwa", amount: "5 łyżek"},
    ],
    steps: ["Ugotuj ryż.", "Ugotowany ryż wymieszaj z koperkim, groszkiem, oliwą i przyprawami."],
    difficulty: "easy",
    prepTimeMinutes: 25,
    mealType: "dinner",
    servings: 2
},
]