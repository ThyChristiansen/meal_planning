import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';


function* fetchRecipes(action) {
  try {
    const input = action.payload.input;
    const typeMeal = action.payload.meal;
    const minCalories = action.payload.calories[0];
    const maxCalories = action.payload.calories[1];
    const minFat = action.payload.fat[0];
    const maxFat = action.payload.fat[1];
    const minProtein = action.payload.protein[0];
    const maxProtein = action.payload.protein[1];
    const diet = action.payload.diet;
    const intolerances = action.payload.intolerances;
    // const loading = false

    console.log('input from saga', input, typeMeal, minCalories, maxCalories, minFat, maxFat,minProtein,maxProtein, diet,intolerances)

    const response = yield axios.get(`/api/searchRecipes/${input}/${typeMeal}/${minCalories}/${maxCalories}/${minFat}/${maxFat}/${minProtein}/${maxProtein}/${diet}/${intolerances}`)
    yield put({
      type: 'SET_RECIPES',
      payload: response.data
    });
    // yield put({
    //   loading: true
    // });

    // console.log('-------->from fetchRecipesSaga', response.data)

  } catch (error) {
    console.log('Search recipes is error:', error);
  }

}

function* fetchRecipeInfo(action) {
  try {
    const id = action.payload.id;  
    console.log('recipe-info from saga',id)
    const response = yield axios.get(`/api/searchRecipes/recipe-info/${id}`)
   
    yield put({
      type: 'SET_RECIPE_INFO',
      payload: response.data
    });
    // console.log('-------->from fetch Recipes info Saga', response.data)
  } catch (error) {
    console.log('Get recipes info is error:', error);
  }
}

function* fetchRecipeSummary(action) {
  try {
    const id = action.payload.id;  
    console.log('recipe-summary from saga',id)
    const response = yield axios.get(`/api/searchRecipes/recipe-summary/${id}`)
   
    yield put({
      type: 'SET_RECIPE_SUMMARY',
      payload: response.data
    });
    // console.log('-------->from fetch Recipes info Saga', response.data)
  } catch (error) {
    console.log('Get recipes summary is error:', error);
  }

}

function* fetchSimilarRecipe(action) {
  try {
    const id = action.payload.id
    console.log(id)
    const response = yield axios.get(`/api/searchRecipes/similar-recipe/${id}`)
    yield put({
      type: 'SET_SIMILAR_RECIPE',
      payload: response.data
    });
  } catch (error) {
    console.log('Similar Recipe is error:', error);
  }
}

function* searchRecipesSaga() {
  yield takeLatest('FETCH_RECIPES', fetchRecipes);
  yield takeLatest('FETCH_RECIPE_INFO', fetchRecipeInfo);
  yield takeLatest('FETCH_RECIPE_SUMMARY', fetchRecipeSummary);
  yield takeLatest('FETCH_SIMILAR_RECIPE', fetchSimilarRecipe);

}

export default searchRecipesSaga;