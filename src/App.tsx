import React from "react"
import { Entete } from "./components/Entete"
import { Formulaire, FormulaireData } from "./components/Formulaire"
import { usePersistedState } from "./hooks/usePersistedState"

function App() {
  const [formulaires, setFormulaires] = usePersistedState<FormulaireData[]>("formulaires", [])
  const [currentId, setCurrentId] = usePersistedState<string | null>("currentId", null)
  const current = React.useMemo(() => formulaires.find((f) => f.id === currentId), [formulaires, currentId])

  // helper to update a specific form
  const setFormValues = (id: string, values: Partial<FormulaireData>) => {
    setFormulaires((prev) => prev.map((f) => (f.id === id ? { ...f, ...values } : f)))
  }

  // helper to append a new form
  const appendForm = (form: FormulaireData) => {
    setFormulaires((prev) => [form, ...prev])
  }

  // helper to remove a specific form
  const removeForm = (id: string) => {
    setFormulaires((prev) => prev.filter((f) => f.id !== id))
  }

  // helper to print a specific form
  const printForm = (id: string) => {
    const form = formulaires.find((f) => f.id === id)
    if (form) {
      window.print()
    }
  }

  // helper to select a specific form
  const selectForm = (id: string) => {
    setCurrentId(id)
  }

  return (
    <div className='min-h-screen'>
      <Entete formulaires={formulaires} {...{ appendForm, selectForm, setFormValues, removeForm, setFormulaires }} />

      <main className='py-6 max-w-4xl mx-auto'>
        {current ? (
          <Formulaire values={current} onValuesChange={(values) => setFormValues(current.id, values)} />
        ) : (
          <div className='text-center py-12'>
            <h2 className='text-2xl font-semibold text-gray-600 mb-4'>Aucun formulaire sélectionné</h2>
            <p className='text-gray-500 mb-6'>Créez un nouveau formulaire ou sélectionnez-en un existant</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
