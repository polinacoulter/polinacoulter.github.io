var addButton = document.querySelector("#add-place");
var newDiv = document.querySelector("#new-box");
newDiv.style.display = "none";
document.querySelector('#logged-in-page').style.display = "none";
document.querySelector('#signup-box').style.display = "none";

var signupButton = document.querySelector('#sign-up-button');
var loginButton = document.querySelector('#login-button');

var switchToSignupButton = document.querySelector('#switch-to-signup-button');
var switchToLoginButton = document.querySelector('#switch-to-login-button');

switchToSignupButton.onclick = function() {
	document.querySelector('#login-box').style.display = "none";
	document.querySelector('#signup-box').style.display = "block";
}
switchToLoginButton.onclick = function() {
	document.querySelector('#login-box').style.display = "block";
	document.querySelector('#signup-box').style.display = "none";
}

function switchToLoggedIn() {
	document.querySelector('#login-box').style.display = "none";
	document.querySelector('#signup-box').style.display = "none";
	document.querySelector('#logged-in-page').style.display = "block";
}

function switchToLoggedOut() {
	document.querySelector('#login-box').style.display = "block";
	document.querySelector('#signup-box').style.display = "none";
	document.querySelector('#logged-in-page').style.display = "none";
}

loginButton.onclick = function() {
	var email = document.querySelector('#login-email').value;
	var password = document.querySelector('#login-password').value;
	var errorMessage = document.querySelector("#login-error-message");

	if (email == '' | password == ''){
		errorMessage.innerHTML = "The field's should be empty dummy";
		errorMessage.style.display = 'block';
	} else {
		errorMessage.style.display = 'none';
		var data = "email=" + encodeURIComponent(email);
		data += "&password=" + encodeURIComponent(password);
		fetch("https://foo-foo-foo.herokuapp.com/sessions", {
			method: "POST", 
			body: data, 
			credentials: 'include',
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			}
		}).then(function (response){
			if(response.status == 401){
				errorMessage.innerHTML = "Wrong email or password, try again";
				errorMessage.style.display = 'block';
			} else if(response.status == 201){
				switchToLoggedIn();
				loadReviewsFromServer();
			}
		});
	}
}

signupButton.onclick = function() {
	var firstName = document.querySelector('#signup-first-name').value;
	var lastName = document.querySelector('#signup-last-name').value;
	var email = document.querySelector('#signup-email').value;
	var password = document.querySelector('#signup-password').value;
	var errorMessage = document.querySelector("#signup-error-message");

	if (firstName == '' | lastName == '' | email == '' | password == ''){
		errorMessage.innerHTML = "The field's shouldn't be left empty dummy";
		errorMessage.style.display = 'block';
	} else {
		var data = "fname=" + encodeURIComponent(firstName);
		data += "&lname=" + encodeURIComponent(lastName);
		data += "&email=" + encodeURIComponent(email);
		data += "&password=" + encodeURIComponent(password);

		fetch("https://foo-foo-foo.herokuapp.com/users", {
			method: "POST",
			body: data,
			credentials: 'include',
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			}
		}).then(function (response){
			if(response.status == 422){
				errorMessage.innerHTML = "This email is already registered with an account";
				errorMessage.style.display = 'block';
			} else {
				switchToLoggedIn();
				loadReviewsFromServer();
			}
		});
	}
}

addButton.onclick = function () {
	var userReviewsList = document.querySelector("#user-reviews-list")
	createReviewsOnServer();
}

//call this function when the add button is clicked
function createReviewsOnServer() {
	//the data that gets sent from the client to the server
	var newUserNameInput = document.querySelector("#new-user-name");
	var newUserEmailInput = document.querySelector("#new-user-email");
	var newUserRatingInput = document.querySelector("#new-user-rating");
	var newUserTitleInput = document.querySelector("#new-user-title");
	var newUserReviewInput = document.querySelector("#new-user-review");

	var data = "name=" + encodeURIComponent(newUserNameInput.value);
	data += "&email=" + encodeURIComponent(newUserEmailInput.value);
	data += "&rating=" + encodeURIComponent(newUserRatingInput.value);
	data += "&title=" + encodeURIComponent(newUserTitleInput.value);
	data += "&review=" + encodeURIComponent(newUserReviewInput.value);
	//data += "&cuisine=" + encodeURIComponent(restaurantName);

	fetch("https://foo-foo-foo.herokuapp.com/reviews", {
		//fetch options goes here
		//method, header(s), body
		method: "POST",
		body: data,
		credentials: 'include',
		headers: {
			//headers go here
			//request header to send data to the server
			"Content-Type": "application/x-www-form-urlencoded" 
		}
	}).then(function(response){
		//upload or refresh the data by calling loadFortunesFromServer()
		loadReviewsFromServer();
	});
}

//call this function when the delete button is clicked
function deleteReviewFromServer(review) {
	review_id = review.id;
	fetch(`https://foo-foo-foo.herokuapp.com/reviews/${review_id}`, {
		method: "DELETE",
		credentials: "include",
	}).then(function(response){
		//upload or refresh the data by calling loadFortunesFromServer()
		loadReviewsFromServer();
	});
}

function enterEditMode(editButton, review) {
	var saveButton = document.querySelector("#save-place");
	saveButton.onclick = function () {
		//var userReviewsList = document.querySelector("#user-reviews-list")
		//var newLunchPlaceInput = document.querySelector("#new-lunch-place")
		editRestaurantOnServer(review.id);
		var ogDiv = document.querySelector("#original-box");
		ogDiv.style.display = "inline-block";
		addButton.style.display = "inline-block";

		var newDiv = document.querySelector("#new-box");
		newDiv.style.display = "none";
		saveButton.style.display = "none";
	};
	if (editButton.innerHTML == "EDIT") {
		var ogDiv = document.querySelector("#original-box");
		ogDiv.style.display = "none";
		addButton.style.display = "none";

		var newDiv = document.querySelector("#new-box");
		newDiv.style.display = "inline-block";
		saveButton.style.display = "inline-block";


		var editUserNameInput = document.querySelector("#edit-user-name");
		editUserNameInput.value = review.name
		var editUserEmailInput = document.querySelector("#edit-user-email");
		editUserEmailInput.value = review.email
		var editUserRatingInput = document.querySelector("#edit-user-rating");
		editUserRatingInput.value = review.rating
		var editUserTitleInput = document.querySelector("#edit-user-title");
		editUserTitleInput.value = review.title
		var editUserReviewInput = document.querySelector("#edit-user-review");
		editUserReviewInput.value = review.review
		editButton.innerHTML = "SAVE";
	} else if (editButton.innerHTML == "SAVE"){
		console.log("Review.email is: ", review.email);
		console.log("encoded is: ", encodeURIComponent(review.email));
		editRestaurantOnServer(review.id);
		//deleteReviewFromServer(review);
	}
}

//call this function when the save button is clicked
function editRestaurantOnServer(review_id) {
	var editUserNameInput = document.querySelector("#edit-user-name");
	var editUserEmailInput = document.querySelector("#edit-user-email");
	var editUserRatingInput = document.querySelector("#edit-user-rating");
	var editUserTitleInput = document.querySelector("#edit-user-title");
	var editUserReviewInput = document.querySelector("#edit-user-review");

	var data = "name=" + encodeURIComponent(editUserNameInput.value);
	data += "&email=" + encodeURIComponent(editUserEmailInput.value);
	data += "&title=" + encodeURIComponent(editUserTitleInput.value);
	data += "&review=" + encodeURIComponent(editUserReviewInput.value);
	data += "&rating=" + encodeURIComponent(editUserRatingInput.value);

	fetch(`https://foo-foo-foo.herokuapp.com/reviews/${review_id}`, {
		method: "PUT",
		body: data,
		credentials: "include",
		headers: {
			//request header to send data to the server
			"Content-Type": "application/x-www-form-urlencoded" 
		}
	}).then(function(response){
		// upload/refresh the data by calling load method
		loadReviewsFromServer();
	});
}

function loadReviewsFromServer() {
	fetch("https://foo-foo-foo.herokuapp.com/reviews", {
	 	credentials: 'include',
	}).then(function (response) {
	//fetch("http://localhost:8080/reviews"
	//).then(function (response) {
		if (response.status == 401) {
			//show logging/register divs
			// hid resource list/divs/etc.
			//return:
			switchToLoggedOut();
			return
		} else if (response.status == 200) {
			// show recource list/divs/etc.
			// hide login/register devs
			switchToLoggedIn();
			response.json().then(function (dataFromServer) {
				userReviews = dataFromServer;
				var userReviewsList = document.querySelector("#user-reviews-list")
				userReviewsList.innerHTML = "";

			//use a loop to display all of the data into the DOM
				userReviews.forEach(function (review) {
					//insert data intoa new DOM element
					//code will execute once per item in the list
					var userReviewsItem = document.createElement("dd");
					userReviewsItem.classList.add("user-review-class-div");

					var titleDiv = document.createElement("div");
					titleDiv.innerHTML = review.title;
					titleDiv.classList.add("user-title");
					userReviewsItem.appendChild(titleDiv);

					var ratingDiv = document.createElement("div");
					ratingDiv.innerHTML = review.rating;
					ratingDiv.classList.add("user-rating");
					userReviewsItem.appendChild(ratingDiv);

					var reviewDiv = document.createElement("div");
					reviewDiv.innerHTML = review.review;
					reviewDiv.classList.add("user-review");
					userReviewsItem.appendChild(reviewDiv);

					var nameDiv = document.createElement("div");
					nameDiv.innerHTML = review.name;
					nameDiv.classList.add("user-name");
					userReviewsItem.appendChild(nameDiv);

					var emailDiv = document.createElement("div");
					emailDiv.innerHTML = review.email;
					emailDiv.classList.add("user-email");
					userReviewsItem.appendChild(emailDiv);

					var deleteButton = document.createElement("button");
					deleteButton.innerHTML = "DELETE";
					deleteButton.onclick = function () {
						if (confirm("Are you sure you want to delete this?")){
							deleteReviewFromServer(review);
						}
					};
					
					var editButton = document.createElement("button");
					editButton.innerHTML = "EDIT";
					editButton.classList.add("edit-button");
					editButton.onclick = function() {
						enterEditMode(editButton, review);
					};

					userReviewsItem.appendChild(deleteButton);
					userReviewsItem.appendChild(editButton);

					userReviewsList.appendChild(userReviewsItem);

				});
			});
		}
	});
}

//when the page laods:
loadReviewsFromServer();

