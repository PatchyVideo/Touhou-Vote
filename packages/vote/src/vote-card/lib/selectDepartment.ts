import { type Department, type DepartmentState, departments } from './types'
export function selectDepartment(
  requested: unknown,
  states: Record<Department, DepartmentState>
): Department | undefined {
  if (
    typeof requested === 'string' &&
    departments.includes(requested as Department) &&
    ['ready', 'loading'].includes(states[requested as Department].status)
  )
    return requested as Department
  for (const department of departments) {
    if (states[department].status === 'loading') return undefined
    if (states[department].status === 'ready') return department
  }
  return typeof requested === 'string' && departments.includes(requested as Department)
    ? (requested as Department)
    : undefined
}
