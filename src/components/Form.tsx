import { categories } from "../data/categories";
import {v4 as uuidv4} from 'uuid'
import { ActivityActions, ActivityState } from "../reducers/activityReducer";
import { Activity } from "../types";
import { useState, useEffect } from "react";
type formProps = {
    dispatch: React.Dispatch<ActivityActions>,
    state: ActivityState

}

const initialState :Activity = {
    id: uuidv4(),
    category: 1,
    name: '',
    calories: 0
}

function Form({dispatch, state}: formProps) {
    const [activity, setActivity] = useState<Activity>(initialState)

    useEffect(()=>{
        if(state.activeId){
            const selectedActivity = state.activities.filter(stateActivity => stateActivity.id === state.activeId)[0]
            setActivity(selectedActivity)
        }
    },[state.activeId])

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>)=>{
        const isNumberField = ['category', 'calories'].includes(e.target.id)
        setActivity({
            ...activity,
            [e.target.id]: isNumberField ? +e.target.value : e.target.value
        })
    }

    const isValidActivity = ()=>{
        const {name, calories} = activity
        return name.trim() !== '' && calories >0
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        dispatch({type: 'save-activity', payload: {newActivity: activity}})
        setActivity({
            ...initialState,
            id: uuidv4()
        })

    }

  return (
    <form className="space-y-5 bg-white shadow p-10 rounded-lg"
    onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 gap-3">
        <label className="font-bold" htmlFor="category">
          Categoría:
        </label>
        <select
          className="border border-slate-300 p-2 rounded-lg w-full bg-white"
          id="category"
          value={activity.category}
          onChange={handleChange}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <label className="font-bold" htmlFor="name">
          Actividad:
        </label>
        <input
          id="name"
          type="text"
          className="border-slate-300 p-2 rounded-lg"
          placeholder="Ej. Comida, Jugo de Naranja, Pesas, Ejercicio"
          value={activity.name}
          onChange={handleChange}
        />
      </div>
      <div className="grid grid-cols-1 gap-3">
        <label className="font-bold" htmlFor="calories">
          Calorias:
        </label>
        <input
          id="calories"
          type="number"
          className="border-slate-300 p-2 rounded-lg"
          placeholder="Calorias. Ej. 300"
          value={activity.calories}
          onChange={handleChange}
        />
      </div>
      <input
        type="submit"
        className="bg-gray-800 hover:bg-gray-900 w-full p-2 font-bold uppercase text-white cursor-pointer disabled:opacity-20"
        value={activity.category === 1 ? 'Guardar Comida' : 'Guardar Ejercicio'}
        disabled={!isValidActivity()}
      />
    </form>
  );
}

export default Form;
