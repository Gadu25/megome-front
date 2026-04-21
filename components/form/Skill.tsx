import { useState } from 'react'
import { skillApi } from '@/lib/api/skillApi'

type Skill = {
  id: number
  skillName: string
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
}

const PROFICIENCY_OPTIONS: Skill['proficiency'][] = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert',
]

type Props = {
  initialSkills: Skill[]
}

export default function ProfileSkillForm({ initialSkills }: Props) {
  const { addSkill } = skillApi();
  const [skills, setSkills] = useState<Skill[]>(initialSkills)
  const [newSkill, setNewSkill] = useState({
    skillName: '',
    proficiency: 'Beginner' as Skill['proficiency'],
  })

  const updateSkill = (id: number, field: keyof Skill, value: any) => {
    setSkills((prev) =>
      prev.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    )
  }

  const handleAddSkill = async () => {
    if (!newSkill.skillName.trim()) return

    const res = await addSkill(newSkill);
    console.log("res add", res)

    setSkills((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...newSkill,
      },
    ])

    setNewSkill({
      skillName: '',
      proficiency: 'Beginner',
    })
  }

  const removeSkill = (id: number) => {
    setSkills((prev) => prev.filter((skill) => skill.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Existing Skills */}
      <div className="space-y-4">
        {skills.map((skill) => (
          <div key={skill.id} className="flex gap-2 items-center">
            {/* Skill Name */}
            <input
              type="text"
              className="input input-bordered w-full"
              value={skill.skillName}
              onChange={(e) =>
                updateSkill(skill.id, 'skillName', e.target.value)
              }
            />

            {/* Proficiency */}
            <select
              className="select select-bordered"
              value={skill.proficiency}
              onChange={(e) =>
                updateSkill(
                  skill.id,
                  'proficiency',
                  e.target.value as Skill['proficiency']
                )
              }
            >
              {PROFICIENCY_OPTIONS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>

            {/* Remove */}
            <button
              className="btn btn-error btn-sm"
              onClick={() => removeSkill(skill.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Add New Skill */}
      <div className="border-t pt-4 space-y-2">
        <h3 className="font-medium text-sm opacity-70">Add Skill</h3>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Skill name"
            className="input input-bordered w-full"
            value={newSkill.skillName}
            onChange={(e) =>
              setNewSkill((prev) => ({
                ...prev,
                skillName: e.target.value,
              }))
            }
          />

          <select
            className="select select-bordered"
            value={newSkill.proficiency}
            onChange={(e) =>
              setNewSkill((prev) => ({
                ...prev,
                proficiency: e.target.value as Skill['proficiency'],
              }))
            }
          >
            {PROFICIENCY_OPTIONS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>

          <button className="btn btn-primary" onClick={handleAddSkill}>
            Add
          </button>
        </div>
      </div>
    </div>
  )
}