import { UseFormReturn } from 'react-hook-form';
import { FC, useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from '@/components/ui/credenza';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FormField } from '@/components/global/FormField';
import { Trash } from 'lucide-react';
import { TProductListingUpdateSchema } from '../../-utils/product-schema';

export default function FAQSection(props: {
  form: UseFormReturn<TProductListingUpdateSchema>;
}) {
  const liveValues = props.form.watch();
  return (
    <FormField
      label='FAQs'
      error={props.form.formState.errors.faqs?.message}
      name='faqs'
    >
      <Accordion type='single' collapsible className='space-y-5'>
        {liveValues.faqs?.map((faq, index) => (
          <AccordionItem
            value={`item-${index}`}
            className='border border-border rounded-2xl shadow-md px-5 relative'
          >
            <AccordionTrigger className='py-3'>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
            <button
              type='button'
              onClick={() => {
                props.form.setValue(
                  'faqs',
                  liveValues.faqs?.filter((_, i) => i !== index)
                );
              }}
              className='absolute -right-0 -top-5 flex h-full flex-col items-center justify-center text-destructive'
            >
              <Trash className='w-4 h-4' />
            </button>
          </AccordionItem>
        ))}
      </Accordion>
      <div className='flex justify-end'>
        <AddFAQ
          onAdd={(faq) =>
            props.form.setValue('faqs', [...(liveValues.faqs ?? []), faq])
          }
        />
      </div>
    </FormField>
  );
}

const AddFAQ: FC<{
  onAdd: ({ question, answer }: { question: string; answer: string }) => void;
}> = ({ onAdd }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  function addFAQ() {
    if (!question.length || !answer.length) return;
    onAdd({ question, answer });
    setQuestion('');
    setAnswer('');
    setIsOpen(false);
  }

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaTrigger asChild>
        <Button
          type='button'
          variant='outline'
          className='rounded-full text-xs'
        >
          + Add FAQs
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Create FAQs</CredenzaTitle>
          <CredenzaDescription>
            Create a FAQ for your product, this will help your customers to know
            more about your product.
          </CredenzaDescription>
        </CredenzaHeader>
        <div className='space-y-5'>
          <Input
            type='text'
            placeholder='Enter FAQ Question'
            label='Question'
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
          />
          <Input
            type='text'
            placeholder='Enter FAQ Answer'
            label='Answer'
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
          />
          <Button
            type='button'
            variant='default'
            className='w-full'
            onClick={addFAQ}
          >
            Add
          </Button>
        </div>
      </CredenzaContent>
    </Credenza>
  );
};
