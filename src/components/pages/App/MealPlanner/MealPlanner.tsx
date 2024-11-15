/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';

import { toast } from 'react-toastify';

import { fetchUserData } from '../Account/Account.helpers';

import { MealPlannerPresentation } from './MealPlannerPresentation';

import { fetchRecipeInformation, fetchRecipes, FetchRecipesParams } from '@src/services/spoonacular-service';
import { paramsType } from '@components/molecules/MealGenerator/MealGenerator';
import { useAuth } from '@src/contexts/AuthContext';

interface Recipe {
  id: number;
  title: string;
  image?: string;
}

export const MealPlanner = () => {
  const [pagesOfMeals, setPagesOfMeals] = useState<Recipe[][]>([]);
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [diet, setDiet] = useState('');
  const [intolerances, setIntolerances] = useState<string[]>([]);
  const [includedCuisines, setIncludedCuisines] = useState<string[]>([]);
  const [excludedCuisines, setExcludedCuisines] = useState<string[]>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecipeInfo, setSelectedRecipeInfo] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchUserData(user);
        setUserData(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setIsLoading(false);
      }
    };

    if (user) {
      getUserData();
    }
  }, [user]);

  useEffect(() => {
    if (userData && userData.accountDetails) {
      setDiet(userData.accountDetails.diet || '');
      setIntolerances(userData.accountDetails.intolerances || []);
      setIncludedCuisines(
        userData.accountDetails.cuisinePreferences?.includedCuisines || []
      );
      setExcludedCuisines(
        userData.accountDetails.cuisinePreferences?.excludedCuisines || []
      );
    }
  }, [userData]);

  const selectUniqueRandomMeals = (meals: Recipe[], count: number): Recipe[] => {
    const selectedMeals: Recipe[] = [];
    const mealsCopy = [...meals];
    for (let i = 0; i < count && mealsCopy.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * mealsCopy.length);
      selectedMeals.push(mealsCopy[randomIndex]);
      mealsCopy.splice(randomIndex, 1);
    }
    return selectedMeals;
  };

  const createPagesFromRecipes = (recipes: Recipe[], totalPages: number) => {
    const pages: Recipe[][] = [];
    const availableRecipes = [...recipes];
    for (let i = 0; i < totalPages; i++) {
      const randomSelection = selectUniqueRandomMeals(availableRecipes, 2);
      pages.push(randomSelection);

      randomSelection.forEach((recipe) => {
        const index = availableRecipes.findIndex((r) => r.id === recipe.id);
        if (index !== -1) {
          availableRecipes.splice(index, 1);
        }
      });

      if (availableRecipes.length < 2) {
        availableRecipes.push(...recipes.filter((recipe) => !pages
          .flat().some((selected) => selected.id === recipe.id)));
      }
    }
    return pages;
  };

  const handleGenerateMeals = async (params: paramsType) => {
    setApiLoading(true);
    setApiError(null);

    const combinedParams: FetchRecipesParams = {
      type: params.type,
      query: params.query,
      diet,
      intolerances: intolerances.join(','),
      cuisines: includedCuisines.join(','),
      excludeCuisines: excludedCuisines.join(','),
      minCalories: params.minCalories || undefined,
      maxCalories: params.maxCalories || undefined,
      minSugar: params.minSugar || undefined,
      maxSugar: params.maxSugar || undefined,
      number: 100,
    };

    try {
      const data = await fetchRecipes(combinedParams);
      if (data.results && Array.isArray(data.results)) {
        const totalResults = data.results.length;
        if (totalResults === 0) {
          setApiError('No recipes found.');
        }

        const formattedMeals: Recipe[] = data.results.map((recipe: Recipe) => ({
          id: recipe.id,
          title: recipe.title,
          image: recipe.image || '',
        }));

        // Calculate the number of pages based on available recipes (50 max)
        const pagesToCreate = Math.min(Math.ceil(totalResults / 2), 50);
        const pages = createPagesFromRecipes(formattedMeals, pagesToCreate);
        setPagesOfMeals(pages);
      } else {
        setApiError('No recipes found.');
        setPagesOfMeals([]);
      }
    } catch (err: any) {
      console.error('Error fetching recipes:', err);
      setApiError(err.message || 'Failed to fetch recipes.');
      setPagesOfMeals([]);
    } finally {
      setApiLoading(false);
    }
  };

  const handleSeeMore = async (id: number) => {
    try {
      setIsModalLoading(true);
      setIsModalOpen(true);
      const data = await fetchRecipeInformation(id);
      setSelectedRecipeInfo(data);
    } catch (err) {
      console.error('Failed to fetch recipe information:', err);
      setError('Failed to fetch recipe information. Please try again later.');
    } finally {
      setIsModalLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error) {
    toast.error(error, { position: 'bottom-left' });
  }

  return (
    <MealPlannerPresentation
      handleGenerateMeals={handleGenerateMeals}
      selectedMeals={pagesOfMeals[currentPage - 1] || []}
      isLoading={isLoading || apiLoading || loading}
      apiError={apiError}
      currentPage={currentPage}
      totalPages={pagesOfMeals.length}
      onPageChange={handlePageChange}
      onSeeMore={handleSeeMore}
      selectedRecipeInfo={selectedRecipeInfo}
      isModalOpen={isModalOpen}
      isModalLoading={isModalLoading}
      onCloseModal={() => setIsModalOpen(false)}
    />
  );
};
