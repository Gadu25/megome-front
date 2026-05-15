import { useState, useRef } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { addSkillClient, updateSkillClient, deleteSkillClient } from '@/lib/api/client/skill';
import { useToast } from "../toast/useToast";
import { withRequest } from "@/functions/withRequest";
import type { Skill, SkillForm } from '@/types/types'
import Modal from '../modal/Modal'

const PROFICIENCY_OPTIONS: Skill['proficiency'][] = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert',
]

type Props = {
  initialSkills: Skill[];
  setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
}

export default function ProfileSkillForm({ initialSkills, setSkills }: Props) {
  const { showToast } = useToast();

  const debounceRef = useRef<Record<number, NodeJS.Timeout>>({});

  const [newSkill, setNewSkill] = useState({ skillName: '', proficiency: 'Beginner' as Skill['proficiency'] })
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null);

  const handleUpdateSkill = (id: number, field: keyof Skill, value: Skill[keyof Skill] ) => {
    let updatedSkill: Skill | undefined;
    let previousItem: Skill | undefined;

    setSkills((prev) => {
      const next = prev.map((skill) => {
        if (skill.id === id) {
          previousItem = skill;
          updatedSkill = { ...skill, [field]: value };
          return updatedSkill;
        }
        return skill;
      });
      return next;
    });

    if (debounceRef.current[id]) {
      clearTimeout(debounceRef.current[id]);
    }

    debounceRef.current[id] = setTimeout(async () => {
      if (!updatedSkill) return;

      try {
        const data = await withRequest(
          () => updateSkillClient(id, updatedSkill as SkillForm),
          showToast
        )

        if (!data) return;

        setSkills((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, ...data.skill } : item
          )
        );
      } catch (err) {
        console.error('Failed to update skill', err);
        if (previousItem) {
          setSkills((prev) =>
            prev.map((item) =>
              item.id === id ? previousItem! : item
            )
          )
        }
      }
    }, 500);
  };

  const handleAddSkill = async () => {
    if (!newSkill.skillName.trim()) return

    const data = await withRequest(
      () => addSkillClient(newSkill as SkillForm),
      showToast
    )

    if (!data) return;

    setSkills((prev) => [...prev, data.skill]);

    setNewSkill({
      skillName: '',
      proficiency: 'Beginner',
    })
  }

  const handleDeleteSkill = async () => {
    if (selectedSkillId === null) return;

    const data = await withRequest(
      () => deleteSkillClient(selectedSkillId),
      showToast
    )

    if (!data) return;
    setSelectedSkillId(null);
    setSkills((prev) =>
      prev.filter((item) => item.id !== selectedSkillId)
    );
  }

  const proceedCancel = async () => {
    handleDeleteSkill()
  }

  return (
    <>
      <div className="space-y-6">
        <div className="space-y-4">
          {initialSkills.map((skill) => (
            <div key={skill.id} className="flex gap-2 items-center">
              <input type="text" className="input input-bordered w-full" value={skill.skillName}
                onChange={(e) =>
                  handleUpdateSkill(skill.id, 'skillName', e.target.value)
                }
              />

              <select className="select select-bordered" value={skill.proficiency}
                onChange={(e) => handleUpdateSkill(skill.id, 'proficiency', e.target.value as Skill['proficiency'])}
              >
                {PROFICIENCY_OPTIONS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>

              <button className="btn btn-error btn-xs"
                onClick={() => {
                  setSelectedSkillId(skill.id);
                  setModalOpen(true);
                }}
              >
                <XMarkIcon className="size-4"/>
              </button>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 space-y-2">
          <h3 className="font-medium text-sm">Add Skill</h3>

          <div className="flex gap-2 items-end">
            <fieldset className="fieldset relative w-full p-0">
              <label className="label">Skill</label>
              <input type="text" placeholder="Skill name" className="input input-bordered w-full" value={newSkill.skillName}
                onChange={(e) => setNewSkill((prev) => ({ ...prev, skillName: e.target.value, }))}
              />
            </fieldset>
            
            <fieldset className="fieldset relative w-full p-0">
              <label className="label">Proficiency</label>
              <select className="select select-bordered" value={newSkill.proficiency}
                onChange={(e) => setNewSkill((prev) => ({ ...prev, proficiency: e.target.value as Skill['proficiency'], }))}
              >
                {PROFICIENCY_OPTIONS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </fieldset>

            <button className="btn btn-primary" onClick={handleAddSkill}>
              Add
            </button>
          </div>
        </div>
      </div>
      
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Delete Skill"
        onAccept={() => proceedCancel()}
        onCancel={() => setModalOpen(false)}
        acceptText="Delete"
      >
        <p>Are you sure you want to delete this item? This is irreversible.</p>
      </Modal>
    </>
  )
}