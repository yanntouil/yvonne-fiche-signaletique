import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { A, F } from "@mobily/ts-belt"
import { X } from "lucide-react"
import React from "react"

export interface FormulaireData {
  id: string
  nom: string
  contenu: string
  data: Data
  dateCreation: string
}
type Data = {
  roomPayment: {
    individual: boolean
    onInvoice: boolean
  }
  extraPayment: {
    individual: boolean
    onInvoice: boolean
  }
  guaranteePayment: "ask" | "individual" | "no" | "no-minibar-check" | null
  baggageService: {
    hasBaggageService: boolean
    arrivalTime: string | null
    departureTime: string | null
  }
  dinner: {
    type: "yes" | "only-first-day" | null
    remarks: string
  }
  informations: {
    hasInformations: boolean
    arrivalTime: string | null
    departureTime: string | null
    type: "business" | "tourist" | null
    linkedToEvent: boolean
    eventName: string
    checkIn: "group" | "individual" | null
    managerName: string
    managerContact: string
    message: string
  }
}
export const initialData: Data = {
  roomPayment: {
    individual: false,
    onInvoice: false,
  },
  extraPayment: {
    individual: false,
    onInvoice: false,
  },
  guaranteePayment: null,
  baggageService: {
    hasBaggageService: false,
    arrivalTime: null,
    departureTime: null,
  },
  dinner: {
    type: null,
    remarks: "",
  },
  informations: {
    hasInformations: false,
    arrivalTime: null,
    departureTime: null,
    type: null,
    linkedToEvent: false,
    eventName: "",
    checkIn: null,
    managerName: "",
    managerContact: "",
    message: "",
  },
}
interface FormulaireProps {
  values: FormulaireData
  onValuesChange: (values: FormulaireData) => void
}

export const Formulaire: React.FC<FormulaireProps> = ({ values, onValuesChange }) => {
  const safeData = (data: Partial<Data>) => {
    // Gérer la migration de l'ancien format dinner
    const migratedData = { ...data }
    if (data.dinner && typeof data.dinner === 'string') {
      migratedData.dinner = {
        type: data.dinner as "yes" | "only-first-day",
        remarks: ""
      }
    }
    return {
      ...initialData,
      ...migratedData,
    }
  }
  const data = safeData(values.data)
  return (
    <div className='max-w-4xl mx-auto'>
      {/* En-tête du formulaire */}
      <div className='border-b pb-4 mb-6 text-center'>
        <h2 className='text-2xl font-semibold text-gray-800'>{values.nom}</h2>
      </div>

      {/* Contenu du formulaire */}
      <div className='space-y-6'>
        <div className='p-8 text-left'>
          <div className='space-y-6'>
            {/* roomPayment */}
            <Row>
              <RowTitle>Chambres :</RowTitle>
              <RowContent>
                <CheckboxField
                  value={data.roomPayment.individual}
                  onValueChange={(value) => {
                    onValuesChange({
                      ...values,
                      data: { ...data, roomPayment: { ...data.roomPayment, individual: value } },
                    })
                  }}
                  label='Paiement individuel'
                />
                <CheckboxField
                  value={data.roomPayment.onInvoice}
                  onValueChange={(value) => {
                    onValuesChange({
                      ...values,
                      data: { ...data, roomPayment: { ...data.roomPayment, onInvoice: value } },
                    })
                  }}
                  label='Chambres prises en charge'
                />
                {data.roomPayment.individual && data.roomPayment.onInvoice && (
                  <span className='text-sm text-muted-foreground italic ml-2'>
                    → Voir remarques
                  </span>
                )}
              </RowContent>
            </Row>
            {/* extraPayment */}
            <Row className={cn(!data.extraPayment.individual && !data.extraPayment.onInvoice && "print:hidden")}>
              <RowTitle>Extras :</RowTitle>
              <RowContent>
                <CheckboxField
                  value={data.extraPayment.individual}
                  onValueChange={(value) => {
                    onValuesChange({
                      ...values,
                      data: { ...data, extraPayment: { ...data.extraPayment, individual: value } },
                    })
                  }}
                  label='Paiement individuel'
                />
                <CheckboxField
                  value={data.extraPayment.onInvoice}
                  onValueChange={(value) => {
                    onValuesChange({
                      ...values,
                      data: { ...data, extraPayment: { ...data.extraPayment, onInvoice: value } },
                    })
                  }}
                  label='Extras prises en charge'
                />
              </RowContent>
            </Row>
            {/* guaranteePayment */}
            <Row>
              <RowTitle>Garantie :</RowTitle>
              <RowContent className='flex-col'>
                <CheckboxField
                  value={data.guaranteePayment === "ask"}
                  onValueChange={(value) => {
                    onValuesChange({
                      ...values,
                      data: { ...data, guaranteePayment: value ? "ask" : null },
                    })
                  }}
                  label='Demander la garantie au guide / responsable'
                />
                <CheckboxField
                  value={data.guaranteePayment === "individual"}
                  onValueChange={(value) => {
                    onValuesChange({
                      ...values,
                      data: { ...data, guaranteePayment: value ? "individual" : null },
                    })
                  }}
                  label='Individuelle'
                />
                <CheckboxField
                  value={data.guaranteePayment === "no"}
                  onValueChange={(value) => {
                    onValuesChange({
                      ...values,
                      data: { ...data, guaranteePayment: value ? "no" : null },
                    })
                  }}
                  label='Ne pas demander, les extras seront pris en charge par la société'
                />
                <CheckboxField
                  value={data.guaranteePayment === "no-minibar-check"}
                  onValueChange={(value) => {
                    onValuesChange({
                      ...values,
                      data: { ...data, guaranteePayment: value ? "no-minibar-check" : null },
                    })
                  }}
                  label='Ne pas demander, mais le check minibar doit être fait avant départ'
                />
              </RowContent>
            </Row>
            {/* baggageService */}
            <Row className={cn(!data.baggageService.hasBaggageService && "print:hidden")}>
              <RowTitle>
                <Checkbox
                  checked={data.baggageService.hasBaggageService}
                  onCheckedChange={(value) => {
                    onValuesChange({
                      ...values,
                      data: {
                        ...data,
                        baggageService: {
                          ...data.baggageService,
                          hasBaggageService: value === "indeterminate" ? false : value,
                        },
                      },
                    })
                  }}
                  className='print:hidden'
                />
                <span>Service bagage{data.baggageService.hasBaggageService ? " :" : ""}</span>
              </RowTitle>
              {data.baggageService.hasBaggageService === true && (
                <RowContent className='flex-col -mt-2'>
                  <div className='grid print:hidden grid-cols-[8rem_auto_1fr] gap-x-8 items-center'>
                    <div className='text-gray-500 w-max shrink-0'>Arrivée : </div>
                    <div className='relative'>
                      <Input
                        type='time'
                        value={data.baggageService.arrivalTime ?? ""}
                        onChange={(e) => {
                          onValuesChange({
                            ...values,
                            data: {
                              ...data,
                              baggageService: { ...data.baggageService, arrivalTime: e.target.value },
                            },
                          })
                        }}
                        className='pr-10'
                      />
                      <Button
                        variant='ghost'
                        size='sm'
                        icon
                        className='absolute right-0 top-0'
                        onClick={() => {
                          onValuesChange({
                            ...values,
                            data: { ...data, baggageService: { ...data.baggageService, arrivalTime: null } },
                          })
                        }}
                      >
                        <X aria-label='Supprimer' />
                      </Button>
                    </div>
                  </div>
                  <div className='grid print:hidden grid-cols-[8rem_auto_1fr] gap-x-8 items-center'>
                    <div className='text-gray-500 w-max shrink-0'>Depart : </div>
                    <div className='relative'>
                      <Input
                        type='time'
                        value={data.baggageService.departureTime ?? ""}
                        onChange={(e) => {
                          onValuesChange({
                            ...values,
                            data: {
                              ...data,
                              baggageService: { ...data.baggageService, departureTime: e.target.value },
                            },
                          })
                        }}
                        className='pr-10'
                      />
                      <Button
                        variant='ghost'
                        size='sm'
                        icon
                        className='absolute right-0 top-0'
                        onClick={() => {
                          onValuesChange({
                            ...values,
                            data: { ...data, baggageService: { ...data.baggageService, departureTime: null } },
                          })
                        }}
                      >
                        <X aria-label='Supprimer' />
                      </Button>
                    </div>
                  </div>
                  <div className='print:flex hidden flex-col gap-y-1'>
                    <div>
                      Arrivée prévue :{" "}
                      <span className='font-semibold'>
                        {prettifyTime(data.baggageService.arrivalTime) || "Inconnu"}
                      </span>
                    </div>
                    <div>
                      Heure du service bagage au départ :{" "}
                      <span className='font-semibold'>
                        {prettifyTime(data.baggageService.departureTime) || "Inconnu"}
                      </span>
                    </div>
                    <div className='bg-muted-foreground/10 py-3 px-8 rounded-md mt-2'>
                      <h3 className='text-base font-semibold text-gray-800'>Instructions :</h3>
                      <ul className='list-disc text-sm text-muted-foreground pl-4'>
                        <li>Penser à faire signer la decharge</li>
                        <li>Controller les horraires du service bagage pour le départ</li>
                        <li>
                          S&apos;il y&apos;a un changement d&apos;horaire, envoyer un mail au service technique (ajouter
                          Yvonne et Madame Micoud en CC)
                        </li>
                      </ul>
                    </div>
                  </div>
                </RowContent>
              )}
            </Row>
            {/* dinner */}
            <Row className={cn(!data.dinner.type && !data.dinner.remarks && "print:hidden")}>
              <RowTitle>Dîner :</RowTitle>
              <RowContent className='flex-col'>
                <div className='flex gap-x-8'>
                  <CheckboxField
                    value={data.dinner.type === "yes"}
                    onValueChange={(value) => {
                      onValuesChange({
                        ...values,
                        data: { ...data, dinner: { ...data.dinner, type: value ? "yes" : null } },
                      })
                    }}
                    label='Tous les soirs'
                  />
                  <CheckboxField
                    value={data.dinner.type === "only-first-day"}
                    onValueChange={(value) => {
                      onValuesChange({
                        ...values,
                        data: { ...data, dinner: { ...data.dinner, type: value ? "only-first-day" : null } },
                      })
                    }}
                    label='Uniquement le premier soir'
                  />
                </div>
                <div className='grid grid-cols-[10rem_1fr] gap-x-8 items-start mt-4 print:hidden'>
                  <div className='text-gray-500 w-max shrink-0 pt-1'>Remarques : </div>
                  <div className='flex gap-x-8'>
                    <Textarea
                      value={data.dinner.remarks}
                      onChange={(e) => {
                        onValuesChange({
                          ...values,
                          data: { ...data, dinner: { ...data.dinner, remarks: e.target.value } },
                        })
                      }}
                      rows={3}
                      placeholder='Ajouter des remarques'
                    />
                  </div>
                </div>
                {data.dinner.remarks && (
                  <div className='print:flex hidden mt-2'>
                    <div className='bg-muted-foreground/10 py-3 px-8 rounded-md'>
                      <h3 className='text-base font-semibold text-gray-800'>Remarques :</h3>
                      <p className='text-sm text-muted-foreground'>
                        <InterpolateMD
                          strong={(part) => <span className='font-semibold text-foreground'>{part}</span>}
                          italic={(part) => <span className='italic'>{part}</span>}
                          linebreak={() => <br className='block' />}
                        >
                          {data.dinner.remarks}
                        </InterpolateMD>
                      </p>
                    </div>
                  </div>
                )}
              </RowContent>
            </Row>
            {/* informations */}
            <Row className={cn(!data.informations.hasInformations && "print:hidden")}>
              <RowTitle>
                <Checkbox
                  checked={data.informations.hasInformations}
                  onCheckedChange={(value) => {
                    onValuesChange({
                      ...values,
                      data: {
                        ...data,
                        informations: {
                          ...data.informations,
                          hasInformations: value === "indeterminate" ? false : value,
                        },
                      },
                    })
                  }}
                  className='print:hidden'
                />
                <span>Informations{data.informations.hasInformations ? " :" : ""}</span>
              </RowTitle>
              {data.informations.hasInformations === true && (
                <RowContent className='flex-col '>
                  <div className='flex flex-col gap-y-4 print:hidden'>
                    <div className='grid grid-cols-[10rem_1fr] gap-x-8 items-center'>
                      <div className='text-gray-500 w-max shrink-0'>Type de client : </div>
                      <div className='flex gap-x-8'>
                        <CheckboxField
                          value={data.informations.type === "business"}
                          onValueChange={(value) => {
                            onValuesChange({
                              ...values,
                              data: {
                                ...data,
                                informations: { ...data.informations, type: value ? "business" : null },
                              },
                            })
                          }}
                          label='Business'
                        />
                        <CheckboxField
                          value={data.informations.type === "tourist"}
                          onValueChange={(value) => {
                            onValuesChange({
                              ...values,
                              data: { ...data, informations: { ...data.informations, type: value ? "tourist" : null } },
                            })
                          }}
                          label='Loisir'
                        />
                      </div>
                    </div>
                    <div className='grid grid-cols-[10rem_1fr] gap-x-8 items-center'>
                      <div className='text-gray-500 w-max shrink-0'>Lier à un événement : </div>
                      <div className='flex gap-x-4 items-center'>
                        <Checkbox
                          checked={data.informations.linkedToEvent}
                          onCheckedChange={(value) => {
                            onValuesChange({
                              ...values,
                              data: {
                                ...data,
                                informations: {
                                  ...data.informations,
                                  linkedToEvent: value === "indeterminate" ? false : value,
                                },
                              },
                            })
                          }}
                        />
                        {data.informations.linkedToEvent && (
                          <Input
                            value={data.informations.eventName}
                            onChange={(e) => {
                              onValuesChange({
                                ...values,
                                data: { ...data, informations: { ...data.informations, eventName: e.target.value } },
                              })
                            }}
                            placeholder="Nom de l'événement"
                            className='flex-1'
                          />
                        )}
                      </div>
                    </div>
                    <div className='grid grid-cols-[10rem_auto_1fr] gap-x-8 items-center'>
                      <div className='text-gray-500 w-max shrink-0'>Arrivée : </div>
                      <div className='relative'>
                        <Input
                          type='time'
                          value={data.informations.arrivalTime ?? ""}
                          onChange={(e) => {
                            onValuesChange({
                              ...values,
                              data: { ...data, informations: { ...data.informations, arrivalTime: e.target.value } },
                            })
                          }}
                          className='pr-10'
                        />
                        <Button
                          variant='ghost'
                          size='sm'
                          icon
                          className='absolute right-0 top-0'
                          onClick={() => {
                            onValuesChange({
                              ...values,
                              data: { ...data, informations: { ...data.informations, arrivalTime: null } },
                            })
                          }}
                        >
                          <X aria-label='Supprimer' />
                        </Button>
                      </div>
                    </div>
                    <div className='grid grid-cols-[10rem_auto_1fr] gap-x-8 items-center'>
                      <div className='text-gray-500 w-max shrink-0'>Depart : </div>
                      <div className='relative'>
                        <Input
                          type='time'
                          value={data.informations.departureTime ?? ""}
                          onChange={(e) => {
                            onValuesChange({
                              ...values,
                              data: {
                                ...data,
                                informations: { ...data.informations, departureTime: e.target.value },
                              },
                            })
                          }}
                          className='pr-10'
                        />
                        <Button
                          variant='ghost'
                          size='sm'
                          icon
                          className='absolute right-0 top-0'
                          onClick={() => {
                            onValuesChange({
                              ...values,
                              data: { ...data, informations: { ...data.informations, departureTime: null } },
                            })
                          }}
                        >
                          <X aria-label='Supprimer' />
                        </Button>
                      </div>
                    </div>
                    <div className='grid grid-cols-[10rem_1fr] gap-x-8 items-center'>
                      <div className='text-gray-500 w-max shrink-0'>Check-in / Check-out : </div>
                      <div className='flex gap-x-8'>
                        <CheckboxField
                          value={data.informations.checkIn === "group"}
                          onValueChange={(value) => {
                            onValuesChange({
                              ...values,
                              data: {
                                ...data,
                                informations: { ...data.informations, checkIn: value ? "group" : null },
                              },
                            })
                          }}
                          label='Groupe'
                        />
                        <CheckboxField
                          value={data.informations.checkIn === "individual"}
                          onValueChange={(value) => {
                            onValuesChange({
                              ...values,
                              data: {
                                ...data,
                                informations: { ...data.informations, checkIn: value ? "individual" : null },
                              },
                            })
                          }}
                          label='Individuel'
                        />
                      </div>
                    </div>
                    <div className='grid grid-cols-[10rem_1fr] gap-x-8 items-center'>
                      <div className='text-gray-500 w-max shrink-0'>Responssable sur place : </div>
                      <div className='flex gap-x-8'>
                        <Input
                          value={data.informations.managerName}
                          onChange={(e) => {
                            onValuesChange({
                              ...values,
                              data: { ...data, informations: { ...data.informations, managerName: e.target.value } },
                            })
                          }}
                          placeholder='Nom du responsable | #123'
                        />
                      </div>
                    </div>
                    <div className='grid grid-cols-[10rem_1fr] gap-x-8 items-start'>
                      <div className='text-gray-500 w-max shrink-0 pt-1'>Personne de contact : </div>
                      <div className='flex gap-x-8'>
                        <Textarea
                          value={data.informations.managerContact}
                          onChange={(e) => {
                            onValuesChange({
                              ...values,
                              data: { ...data, informations: { ...data.informations, managerContact: e.target.value } },
                            })
                          }}
                          placeholder={"Tel : (+352) 621 123 456\nMail : contact@website.lu"}
                          rows={3}
                        />
                      </div>
                    </div>
                    <div className='grid grid-cols-[10rem_1fr] gap-x-8 items-start'>
                      <div className='text-gray-500 w-max shrink-0 pt-1'>Remarques : </div>
                      <div className='flex gap-x-8'>
                        <Textarea
                          value={data.informations.message}
                          onChange={(e) => {
                            onValuesChange({
                              ...values,
                              data: { ...data, informations: { ...data.informations, message: e.target.value } },
                            })
                          }}
                          rows={4}
                          placeholder='Ajouter des remarques'
                        />
                      </div>
                    </div>
                  </div>
                  <div className='print:flex hidden flex-col gap-y-1'>
                    {data.informations.type && (
                      <div>
                        Type de client :{" "}
                        <span className='font-semibold'>
                          {data.informations.type === "business" ? "Business" : "Loisir"}
                        </span>
                      </div>
                    )}
                    {data.informations.linkedToEvent && data.informations.eventName && (
                      <div>
                        Lié à un événement : <span className='font-semibold'>{data.informations.eventName}</span>
                      </div>
                    )}
                    <div>
                      Arrivée prévue :{" "}
                      <span className='font-semibold'>{prettifyTime(data.informations.arrivalTime) || "Inconnu"}</span>
                    </div>
                    <div>
                      Heure du départ :{" "}
                      <span className='font-semibold'>
                        {prettifyTime(data.informations.departureTime) || "Inconnu"}
                      </span>
                    </div>
                    {data.informations.checkIn && (
                      <div>
                        Check-in / Check-out :{" "}
                        <span className='font-semibold'>
                          {data.informations.checkIn === "group" ? "En groupe" : "Individuel"}
                        </span>
                      </div>
                    )}
                    {data.informations.managerName && (
                      <div>
                        Responsable sur place : <span className='font-semibold'>{data.informations.managerName}</span>
                      </div>
                    )}
                    {data.informations.managerContact && (
                      <div className='flex flex-col gap-y-1'>
                        Personne de contact :{" "}
                        <span className='font-semibold'>
                          <InterpolateMD
                            strong={(part) => <span className='font-bold'>{part}</span>}
                            italic={(part) => <span className='italic'>{part}</span>}
                          >
                            {data.informations.managerContact}
                          </InterpolateMD>
                        </span>
                      </div>
                    )}
                    {data.informations.message && (
                      <div className='bg-muted-foreground/10 py-3 px-8 rounded-md mt-2'>
                        <h3 className='text-base font-semibold text-gray-800'>Remarques :</h3>
                        <p className='text-sm text-muted-foreground'>
                          <InterpolateMD
                            strong={(part) => <span className='font-semibold text-foreground'>{part}</span>}
                            italic={(part) => <span className='italic'>{part}</span>}
                            linebreak={() => <br className='block' />}
                          >
                            {data.informations.message}
                          </InterpolateMD>
                        </p>
                      </div>
                    )}
                  </div>
                </RowContent>
              )}
            </Row>
          </div>
        </div>
      </div>
    </div>
  )
}

const CheckboxField: React.FC<{
  value: boolean
  onValueChange: (value: boolean) => void
  label: string
}> = ({ value, onValueChange, label }) => {
  const isChecked = value === true
  return (
    <label className={cn("flex items-center gap-2", !isChecked && "print:hidden text-muted-foreground")}>
      <Checkbox
        checked={isChecked}
        onCheckedChange={(checked) => {
          onValueChange(checked === "indeterminate" ? false : checked)
        }}
        className='print:hidden'
      />
      <span>{label}</span>
    </label>
  )
}

const Row: React.FC<React.ComponentProps<"div">> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn("grid grid-cols-[11rem_1fr] print:grid-cols-[10rem_1fr] gap-x-8 items-start", className)}
      {...props}
    >
      {children}
    </div>
  )
}
const RowTitle: React.FC<React.ComponentProps<"div">> = ({ className, children, ...props }) => {
  return (
    <h3 className={cn("text-lg font-semibold text-gray-800 flex items-center gap-2", className)} {...props}>
      {children}
    </h3>
  )
}

const RowContent: React.FC<React.ComponentProps<"div">> = ({ className, children, ...props }) => {
  return (
    <div className={cn("flex gap-x-8 pt-0.5 gap-y-2", className)} {...props}>
      {children}
    </div>
  )
}

type InterpolateMDProps = {
  children: string
  strong?: (part: string) => React.ReactNode
  italic?: (part: string) => React.ReactNode
  underline?: (part: string) => React.ReactNode
  linebreak?: () => React.ReactNode
}

export const InterpolateMD = ({
  children,
  strong = F.identity,
  italic = F.identity,
  underline = F.identity,
  linebreak = () => <br />,
}: InterpolateMDProps) => {
  const pattern = /(\*[^*]+\*|_[^_]+_|~[^~]+~| {3}|\n)/g
  const parts = children.split(pattern)

  return (
    <>
      {A.mapWithIndex(parts, (i, part) => {
        if (part.startsWith("*") && part.endsWith("*")) {
          return <React.Fragment key={i}>{strong(part.slice(1, -1))}</React.Fragment>
        }

        if (part.startsWith("\n")) {
          return <React.Fragment key={i}>{linebreak()}</React.Fragment>
        }

        if (part.startsWith("_") && part.endsWith("_")) {
          return <React.Fragment key={i}>{italic(part.slice(1, -1))}</React.Fragment>
        }

        if (part.startsWith("~") && part.endsWith("~")) {
          return <React.Fragment key={i}>{underline(part.slice(1, -1))}</React.Fragment>
        }

        if (part === "   ") {
          return <React.Fragment key={i}>{linebreak()}</React.Fragment>
        }

        return <React.Fragment key={i}>{part}</React.Fragment>
      })}
    </>
  )
}

const prettifyTime = (time: string | null) => {
  if (!time) return ""
  const [hours, minutes] = time.split(":")
  if (!minutes || !hours) return ""
  // replace the first 0 by nothing
  const hoursWithoutFirstZero = hours.replace(/^0/, "")
  return `${hoursWithoutFirstZero}h${minutes}`
}
