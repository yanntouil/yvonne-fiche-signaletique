import { FormulaireData, initialData } from "@/components/Formulaire"
import { cn } from "@/lib/utils"
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  MouseSensor,
  pointerWithin,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { A, G } from "@mobily/ts-belt"
import { GripHorizontal, List, Plus, Printer, X } from "lucide-react"
import React from "react"
import { Button, buttonVariants } from "./ui/button"
import { Input } from "./ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

interface EnteteProps {
  formulaires: FormulaireData[]
  appendForm: (form: FormulaireData) => void
  selectForm: (id: string) => void
  removeForm: (id: string) => void
  setFormValues: (id: string, values: Partial<FormulaireData>) => void
  setFormulaires: (formulaires: FormulaireData[]) => void
}

export const Entete: React.FC<EnteteProps> = (props) => {
  const { formulaires, appendForm, selectForm, removeForm, setFormValues } = props
  const [preventEscape, setPreventEscape] = React.useState(false)
  const printForm = () => {
    window.print()
  }
  return (
    <header className='border-b px-6 py-4 max-w-4xl mx-auto print:hidden'>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-semibold text-gray-800'>Gestionnaire de fiches signalétiques</h1>
        <div className='flex items-center gap-2'>
          <Popover>
            <PopoverTrigger className={buttonVariants({ variant: "outline" })}>
              <List className='mr-3' aria-hidden />
              <span>Liste des fiches ({formulaires.length})</span>
            </PopoverTrigger>
            <PopoverContent
              className='w-80'
              align='end'
              onEscapeKeyDown={(e) => {
                if (preventEscape) {
                  e.preventDefault()
                }
              }}
            >
              <Content {...props} setPreventEscape={setPreventEscape} />
            </PopoverContent>
          </Popover>
          <Button onClick={() => printForm()}>
            <Printer aria-hidden className='mr-3' />
            <span>Imprimer</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

const Content: React.FC<
  {
    setPreventEscape: (preventEscape: boolean) => void
  } & EnteteProps
> = (props) => {
  const [edited, setEdited] = React.useState<FormulaireData | null>(null)
  const { setPreventEscape } = props
  React.useEffect(() => {
    if (edited) {
      setPreventEscape(true)
    } else {
      setPreventEscape(false)
    }
  }, [edited, setPreventEscape])
  const { formulaires, appendForm, selectForm, removeForm, setFormValues, setFormulaires } = props
  const create = () => {
    const id = Date.now().toString()
    const item: FormulaireData = {
      id,
      nom: "",
      contenu: "",
      dateCreation: new Date().toISOString(),
      data: initialData,
    }
    appendForm(item)
    setEdited(item)
  }

  const [active, setActive] = React.useState<string | null>(null)

  const reorder = (oldIndex: number, newIndex: number) => {
    const reordered = arrayMove(formulaires, oldIndex, newIndex)
    setFormulaires(reordered)
  }
  const onDragEnd = (event: DragEndEvent) => {
    setActive(null)
    const { active, over } = event
    if (!(over && active.id !== over.id)) return
    const oldIndex = A.getIndexBy(formulaires, ({ id }) => id === active.id)
    const newIndex = A.getIndexBy(formulaires, ({ id }) => id === over.id)
    if (G.isNullable(oldIndex) || G.isNullable(newIndex)) return
    reorder(oldIndex, newIndex)
  }
  const onDragStart = (event: DragStartEvent) => {
    const { active } = event
    const id = active.id as string
    const item = A.find(formulaires, ({ id }) => id === id)
    setActive(item?.id ?? null)
  }
  const onDragCancel = () => {
    setActive(null)
  }
  const mouseSensor = useSensor(MouseSensor)
  const touchSensor = useSensor(TouchSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      onDragCancel={onDragCancel}
      sensors={sensors}
    >
      <SortableContext items={formulaires.map(({ id }) => id)} strategy={verticalListSortingStrategy}>
        <div className='space-y-3'>
          <Button onClick={create} size='sm' variant='outline' className='w-full'>
            <Plus className='mr-2' aria-hidden />
            <span>Ajouter une fiche</span>
          </Button>
          {formulaires.length > 0 && (
            <div className='space-y-2'>
              {formulaires.map((formulaire) => (
                <Item
                  key={formulaire.id}
                  formulaire={formulaire}
                  update={(values) => setFormValues(formulaire.id, values)}
                  select={() => selectForm(formulaire.id)}
                  remove={() => removeForm(formulaire.id)}
                  edited={edited}
                  setEdited={setEdited}
                  reorder={reorder}
                />
              ))}
            </div>
          )}
        </div>
      </SortableContext>
    </DndContext>
  )
}

const Item: React.FC<{
  formulaire: FormulaireData
  update: (values: FormulaireData) => void
  select: () => void
  remove: () => void
  edited: FormulaireData | null
  setEdited: (form: FormulaireData | null) => void
  reorder: (oldIndex: number, newIndex: number) => void
}> = ({ formulaire, update, select, remove, edited, setEdited, reorder }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: formulaire.id,
  })
  const style = { transform: CSS.Transform.toString(transform), transition }

  const updateAndClose = () => {
    if (!edited) return
    update(edited)
    setEdited(null)
  }
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (edited?.id !== formulaire.id) return
    if (!["Enter", "Escape"].includes(e.key)) return
    console.log(e.key)
    e.stopPropagation()
    e.preventDefault()
    console.log(e.key)
    if (e.key === "Enter") {
      updateAndClose()
    }
    if (e.key === "Escape") {
      setEdited(null)
    }
  }

  return (
    <div
      key={formulaire.id}
      className={cn(
        "group relative flex items-center gap-1 rounded-md bg-card",
        isDragging ? "z-20 opacity-100" : "opacity-100"
      )}
      ref={setNodeRef}
      style={style}
    >
      <Button
        size='sm'
        variant='ghost'
        icon
        {...attributes}
        {...listeners}
        className='group-hover:inline-flex hidden absolute left-0 inset-y-0 hover:bg-transparent transition-all duration-300'
      >
        <GripHorizontal aria-label='Supprimer la fiche' />
      </Button>
      {edited?.id === formulaire.id ? (
        <Input
          type='text'
          placeholder='Nouvelle fiche'
          value={edited.nom}
          onChange={(e) => setEdited({ ...formulaire, nom: e.target.value })}
          autoFocus
          onKeyDown={onKeyDown}
          onBlur={updateAndClose}
          className='pl-8'
        />
      ) : (
        <>
          <Button
            variant='ghost'
            className='grow text-left justify-start pl-8'
            size='sm'
            onClick={() => select()}
            onDoubleClick={() => setEdited(formulaire)}
          >
            {formulaire.nom.trim() || "Nouvelle fiche"}
          </Button>
          {!isDragging && (
            <Button
              size='sm'
              variant='ghost'
              icon
              onClick={() => remove()}
              className='group-hover:inline-flex hidden absolute right-0 inset-y-0 transition-all duration-100'
            >
              <X aria-label='Supprimer la fiche' />
            </Button>
          )}
        </>
      )}
    </div>
  )
}
