import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import {useSelector} from '../../services/store'
import { ingredientsSlice } from '../../services/slice-ingredients';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */

  const { id } = useParams();

  const ingredientData = useSelector( (data)=> 
  ingredientsSlice.selectors.selectedIngredient(data, id)
)

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
