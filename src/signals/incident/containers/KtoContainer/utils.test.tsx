import type { OptionMapped } from './types'
import { sortByTopic } from './utils'
import { getMergedOpenAnswers } from './utils'

describe('utils', () => {
  describe('sortByTopic', () => {
    it('should sort the array correctly with null topics', () => {
      const array: OptionMapped[] = [
        {
          topic: null,
          value: 'Option 3',
          is_satisfied: true,
          key: 'key-3',
          open_answer: false,
        },
        {
          topic: 'Topic A',
          value: 'Option 1',
          is_satisfied: true,
          key: 'key-1',
          open_answer: false,
        },
        {
          topic: 'Topic B',
          value: 'Option 2',
          is_satisfied: true,
          key: 'key-2',
          open_answer: false,
        },
        {
          topic: null,
          value: 'Option 4',
          is_satisfied: true,
          key: 'key-4',
          open_answer: false,
        },
      ]

      const sortedArray = sortByTopic(array)

      expect(sortedArray).toEqual([
        {
          topic: null,
          value: 'Option 3',
          is_satisfied: true,
          key: 'key-3',
          open_answer: false,
        },
        {
          topic: null,
          value: 'Option 4',
          is_satisfied: true,
          key: 'key-4',
          open_answer: false,
        },
        {
          topic: 'Topic A',
          value: 'Option 1',
          is_satisfied: true,
          key: 'key-1',
          open_answer: false,
        },
        {
          topic: 'Topic B',
          value: 'Option 2',
          is_satisfied: true,
          key: 'key-2',
          open_answer: false,
        },
      ])
    })

    it('should leave the array unchanged if all topics are null', () => {
      const array: OptionMapped[] = [
        {
          topic: null,
          value: 'Option 1',
          is_satisfied: true,
          key: 'key-1',
          open_answer: false,
        },
        {
          topic: null,
          value: 'Option 2',
          is_satisfied: true,
          key: 'key-2',
          open_answer: false,
        },
        {
          topic: null,
          value: 'Option 3',
          is_satisfied: true,
          key: 'key-3',
          open_answer: false,
        },
      ]

      const sortedArray = sortByTopic(array)

      expect(sortedArray).toEqual(array)
    })

    it('should leave the array unchanged if all topics are not null', () => {
      const array: OptionMapped[] = [
        {
          topic: 'Topic A',
          value: 'Option 1',
          is_satisfied: true,
          key: 'key-1',
          open_answer: false,
        },
        {
          topic: 'Topic B',
          value: 'Option 2',
          is_satisfied: true,
          key: 'key-2',
          open_answer: false,
        },
        {
          topic: 'Topic C',
          value: 'Option 3',
          is_satisfied: true,
          key: 'key-3',
          open_answer: false,
        },
      ]

      const sortedArray = sortByTopic(array)

      expect(sortedArray).toEqual(array)
    })
  })

  describe('getMergedOpenAnswers', () => {
    it('should merges open answers correctly', () => {
      const formData = {
        allows_contact: false,
        is_satisfied: true,
        text_list: [
          'Het probleem is helemaal opgelost.',
          'Het probleem is snel opgelost.',
          'Over iets antwoord - nieuw antwoord',
        ],
        text_extra: '',
        'open_answer-Over iets antwoord - nieuw antwoord': 'Test open answers',
      }

      const mergedFormData = getMergedOpenAnswers(formData)
      expect(mergedFormData).toEqual({
        allows_contact: false,
        is_satisfied: true,
        text_list: [
          'Het probleem is helemaal opgelost.',
          'Het probleem is snel opgelost.',
          'Over iets antwoord - nieuw antwoord',
          'Test open answers',
        ],
        text_extra: '',
      })
    })

    it('should merges open answers correctly when open answers inbetween', () => {
      const formData = {
        allows_contact: false,
        is_satisfied: true,
        text_list: [
          'Het probleem is helemaal opgelost.',
          'Het probleem is snel opgelost.',
          'Over iets antwoord - nieuw antwoord',
          'Super gedaan dit',
        ],
        text_extra: '',
        'open_answer-Over iets antwoord - nieuw antwoord': 'Test open answers',
      }

      const mergedFormData = getMergedOpenAnswers(formData)
      expect(mergedFormData).toEqual({
        allows_contact: false,
        is_satisfied: true,
        text_list: [
          'Het probleem is helemaal opgelost.',
          'Het probleem is snel opgelost.',
          'Over iets antwoord - nieuw antwoord',
          'Test open answers',
          'Super gedaan dit',
        ],
        text_extra: '',
      })
    })
  })
})
