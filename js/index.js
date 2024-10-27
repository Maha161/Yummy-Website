//^ Contact Varaibles 
const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const nameRegex = /^[A-Za-z\s]+$/;
const ageRegex = /^(1[01]?[0-9]|[1-9][0-9]?)$/;
//^ loading
jQuery(function(){
    removeLoderScreen(); // remove loader screen
})
function removeLoderScreen() {
    $('.loading').fadeOut(1000 , function(){
        $("body").css({overflow : "auto"}) 
    });
}
//^ nav
const leftNavWidth = $(".left-menu").outerWidth();
$(".side-menu").css({left: `-${leftNavWidth}px`}); // nav is closed by default
let sideStatus = false;
$(".close-icon").on("click", function() {
     if (sideStatus) {
        closeSideMenu();
        } else {
         openSideMenu();
         openNavAnmation();
     }
 });
function openNavAnmation(){
    $(".list-items li").css({ top: "200px" }); 
    for (let i = 0; i < 5; i++) {
       $($(".list-items li")[i]).animate({  top: 0 }, (i + 5) * 100);
   }
} 
function openSideMenu(){
    $(".side-menu").animate({ left: "0px" }, 600);
    $(".close-icon").removeClass("fa-bars").addClass("fa-x"); 
    sideStatus = true;
}
function closeSideMenu(){
    $(".side-menu").animate({ left: `-${leftNavWidth}px` }, 600);
    $(".close-icon").removeClass("fa-x").addClass("fa-bars");
    $(".list-items li").animate({ top: 300 }, 500);
    sideStatus = false;
}
$(".left-menu ul li").on("click" , function(){
    $("html, body").animate({ scrollTop: 0 }, 100, function () {
        closeSideMenu();
    });
})
//^ meals
async function getMeal() {
    $('.loading').css({ display: 'flex' });
    let response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=");
    let data = await response.json();
    if(data.meals !== null){
        removeLoderScreen();
    }
    displayMeals(data.meals);
}
function displayMeals(arr) {   
    $("section").fadeOut(100 , function(){
        $(".meals").fadeIn();
    }) 
    $('.meal-container').html('');
    let container = " ";
    for (let i = 0; i < arr.length; i++) {
        container += 
           `<div class="col-lg-3 col-md-4 pb-4">
              <div class="meal-card meal cards inner position-relative overflow-hidden rounded-3" data-id="${arr[i].idMeal}">
                <div class="card-img overflow-hidden">
                   <img src="${arr[i].strMealThumb}" alt="meal" class="w-100 rounded-3">
                </div>
               <div class="card-overlay d-flex justify-content-center flex-column">
                <h2 class="title ps-2">${arr[i].strMeal}</h2>
               </div>
             </div>
            </div> `;
    }
    $(".meal-container").html(container);
    $(".meal").on("click", async function() {
        $('.loading').css({ display: 'flex' });
        const mealId = $(this).data("id");
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const data = await response.json();
        removeLoderScreen();
        displayMealDetails(data.meals[0]);
    });
}
//^ Meal Details
function displayMealDetails(meal) {
    $("section").fadeOut(10 , function(){
       $('.loading').css({ display: 'flex' });
        $(".meals-details").fadeIn( function(){
            removeLoderScreen();
        });
    })
  
    let ingredients = '';
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="m-2 p-1 rounded-1">${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}</li>`;
        }
    }
    let tagsStr = ""; 
    let tags = meal.strTags ? meal.strTags.split(",") : []; 
    for (let i = 0; i < tags.length; i++) {
    tagsStr += ` <li class="alert alert-danger m-2 p-1">${tags[i].trim()}</li>`; 
    }
    $(".meal-details-container").html(`
        <div class="meal-details d-flex justify-content-between gap-3">
            <div class="col-md-4">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-100 rounded-2">
                <h2 class="title text-white pt-2">${meal.strMeal}</h2>
            </div>
            <div class="col-md-8 text-white ps-2">
                <h3>Instructions</h3>
                <p>${meal.strInstructions}</p>
                <h3 class="area fw-bold">Area: <span class="fw-lighter">${meal.strArea}</span></h3>
                <h3 class="category fw-bold">Category: <span class="fw-lighter">${meal.strCategory}</span></h3>
                <h3>Recipes:</h3>
                <ul class="ingredients-list list-unstyled d-flex g-2 flex-wrap">${ingredients}</ul>
               <h3> Tags: </h3>
                <ul class="list-unstyled d-flex g-2 flex-wrap">${tagsStr}</ul>
                <a href="${meal.strSource}" class="btn btn-success px-4">Source</a>
                <a href="${meal.strYoutube}" class="btn btn-danger px-3 ">YouTube</a>
            </div>
        </div>
    `);
}
//^ Search
$(".search-link").on("click" , function(){
    $("section").fadeOut(100 , function(){
        $(".search").fadeIn();
        $(".search-by-first-letter").val("");
        $(".search-by-name").val("");
        $('.search-data').html('');
        $(".search-container").removeClass("d-none")
    })
})
//^ Search By Name
async function getMealsByName(mealName){
   let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`);
   let data = await response.json();
   return data.meals;
}
$(".search-by-name").on("input" ,async function(){
    $('.loading').css({ display: 'flex' });
    let mealName = $(this).val();
    let meals = await getMealsByName(mealName);
    removeLoderScreen();
    let container = " ";
    if(meals && meals.length > 0 ){
    for(let i = 0 ; i < meals.length ; i++){
        container += 
        `<div class="col-md-3 pb-4">
           <div class="meal-card meal cards inner position-relative" data-id="${meals[i].idMeal}">
            <div class="card-img overflow-hidden">
                <img src="${meals[i].strMealThumb}" alt="meal" class="w-100">
            </div>
            <div class="card-overlay d-flex justify-content-center flex-column">
                <h2 class="title ps-2">${meals[i].strMeal}</h2>
            </div>
        </div>
     </div>`
    }
}
    $(".search-data").html(container);
    $(".meal").on("click", async function() {
        const mealId = $(this).data("id");
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const data = await response.json();
        displayMealDetails(data.meals[0]);
    }); 
})
//^ Search By Letter
async function getMealsByFirstLetter(FirstLetter) {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${FirstLetter}`);
    let data = await response.json();
    return data.meals;
}
$(".search-by-first-letter").on("input", async function() {
    let FirstLetter = $(this).val().trim();
    $('.loading').css({ display: 'flex' });
    if (FirstLetter === "") {
        FirstLetter = "A";
    }
    let meals = await getMealsByFirstLetter(FirstLetter);
    removeLoderScreen();

    let container = "";
    if (meals) {
        for (let i = 0; i < meals.length; i++) {
            container += 
            `<div class="col-md-3 pb-4">
               <div class="meal-card meal cards inner position-relative" data-id="${meals[i].idMeal}">
                <div class="card-img overflow-hidden">
                    <img src="${meals[i].strMealThumb}" alt="meal" class="w-100">
                </div>
                <div class="card-overlay d-flex justify-content-center flex-column">
                    <h2 class="title ps-2">${meals[i].strMeal}</h2>
                </div>
            </div>
         </div>`;
        }
    }
    $(".search-data").html(container);
    $(".meal").on("click", async function() {
        const mealId = $(this).data("id");
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const data = await response.json();
        displayMealDetails(data.meals[0]);
    });
});
//^ Category
$(".category-link").on("click" , function(){
   displayCategory();
})
async function getCategory(){
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    let data = await response.json();
    return data.categories;
}
async function getMealByCategory(categoryName){
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`);
    let data = await response.json();
    return data.meals;
} 
async function displayCategory(){
    $("section").fadeOut(10, function(){
       $('.loading').css({ display: 'flex' });
        $(".category").fadeIn();
    });
    let categories = await getCategory();
    if(categories !== null){
      removeLoderScreen();
    }
    let container = "";
    for (let i = 0; i < categories.length; i++) {
        container += 
        ` <div class="col-lg-3 col-md-4  pb-4">
            <div class="category-card category cards inner position-relative overflow-hidden py-2" data-category="${categories[i].strCategory}">
               <div class="card-img overflow-hidden">
                 <img src="${categories[i].strCategoryThumb}" alt="category" class="w-100">
                </div>
               <div class="card-overlay d-flex justify-content-center flex-column text-center overflow-hidden">
                 <h2 class="title ps-2 pt-4">${categories[i].strCategory}</h2>
                  <p class="description ps-2">${categories[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
            </div>
          </div>`;
    }
    $(".category-data").html(container);
    $(".category").on("click", async function() {
       $('.loading').css({ display: 'flex' });
        const catName = $(this).data("category");
        const meals = await getMealByCategory(catName);
        if(meals !== null){
         removeLoderScreen();
        }
        displayMeals(meals.slice(0, 20));
    });
}
//^ Area 
$(".area-link").on("click" , function(){
    displayArea();
})
async function getArea(){
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    let data = await response.json();
    return data.meals;
}
async function getMealByArea(areaName){
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaName}`);
    let data = await response.json();
    return data.meals;
}
async function displayArea(){
    $("section").fadeOut(10, function(){
       $('.loading').css({ display: 'flex' });
        $(".area").fadeIn();
    });
    let areas = await getArea();
    if(areas !== null){
        removeLoderScreen();
      }
    let container = "";
    for (let i = 0; i < areas.length; i++) {
        container += 
            ` <div class="col-md-3 pb-4 ">
             <div class="area-card area-data area py-2 text-center" data-area="${areas[i].strArea}">
              <i class="fa-solid fa-house-laptop text-white display-3"></i>
              <h2 class="area-title text-white fs-3 pt-1">${areas[i].strArea}</h2>
             </div>
           </div> `;
    }
    $(".area-data").html(container);
    $(".area").on("click", async function() {
       $('.loading').css({ display: 'flex' });
        const areaName = $(this).data("area");
        const meals = await getMealByArea(areaName);
        removeLoderScreen();
        displayMeals(meals.slice(0, 20));
    });
} 
//^ instruction
$(".ingredients-link").on("click" , function(){
    displayIngredients();
})
async function getIngredients(){
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    let data = await response.json();
    return data.meals;
}
async function getMealByIngredients(ingredientsName){
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientsName}`);
    let data = await response.json();
    return data.meals;
}
async function displayIngredients() {
    $("section").fadeOut(100, function() {
       $('.loading').css({ display: 'flex' });
        $(".ingredients").fadeIn();
    });
    let ingredients = await getIngredients();
    if(ingredients !== null){
        removeLoderScreen();
      }
    let container = "";
    for (let i = 0; i < 20; i++) {
        if (ingredients[i].strDescription) {
            let description = ingredients[i].strDescription.split(" ").slice(0, 20).join(" ");
            container += `
                <div class="col-md-3 pb-4">
                    <div class="ingredients-card ingredients-data ingredient py-2 text-center" data-ingredient="${ingredients[i].strIngredient}">
                        <i class="fa-solid fa-drumstick-bite text-white display-3"></i>
                        <h2 class="area-title text-white fs-3 pt-1">${ingredients[i].strIngredient}</h2>
                        <p class="description text-white pt-1">${description}</p>
                    </div>
                </div>`;
        }
    }
    $(".ingredients-data").html(container);
    $(".ingredient").on("click", async function() {
       $('.loading').css({ display: 'flex' });
        const ingredientName = $(this).data("ingredient"); 
        const meals = await getMealByIngredients(ingredientName);
        if(meals !== null){
        removeLoderScreen();
        }
        displayMeals(meals.slice(0, 20));
    });
}
//^ Contact
$(".contact-link").on("click" , function(){
    $(".contact-container").removeClass("d-none");
    displayContactPage();
})
function displayContactPage(){
    $("section").fadeOut(100, function() {
        $(".contact").fadeIn();
    });
}
//^ Validation
function validateInput(inputClass, alertClass, regex) {
    $(inputClass).on("input", function () {
        if (regex.test(this.value)) {
            $(alertClass).addClass("d-none");
        } else {
            $(alertClass).removeClass("d-none");
        }
        checkAllValid();
    });
}
function validateRepass() {
    $(".repassInput").on("input", function () {
        if (this.value === $(".passInput").val()) {
            $(".repassAlert").addClass("d-none");
        } else {
            $(".repassAlert").removeClass("d-none");
        }
        checkAllValid();
    });
}
function checkAllValid() {
    const isValidName = nameRegex.test($(".nameInput").val());
    const isValidEmail = emailRegex.test($(".emailInput").val());
    const isValidPhone = phoneRegex.test($(".phoneInput").val());
    const isValidAge = ageRegex.test($(".ageInput").val());
    const isValidPass = passRegex.test($(".passInput").val());
    const isValidRepass = $(".repassInput").val() === $(".passInput").val();

    if (isValidName && isValidEmail && isValidPhone && isValidAge && isValidPass && isValidRepass) {
        $(".submitBtn").removeClass("disabled");
    } else {
        $(".submitBtn").addClass("disabled");
    }
}
function callValidateForInputs(){
    validateInput(".nameInput", ".nameAlert", nameRegex);
    validateInput(".emailInput", ".emailAlert", emailRegex);
    validateInput(".phoneInput", ".phoneAlert", phoneRegex);
    validateInput(".ageInput", ".ageAlert", ageRegex);
    validateInput(".passInput", ".passAlert", passRegex);
    validateRepass();
}
callValidateForInputs();
//^ Run
getMeal();







