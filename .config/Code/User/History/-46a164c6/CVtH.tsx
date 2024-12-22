import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn, getCountryName } from '@/lib/utils';
import {
  DiscardLeadDialog,
  LeadPhoneCallDialog,
  LeadPhoneChatDialog,
} from '../-components/lead-dialogs';
import { TLead } from '../-utils/useLeads';
import { Eye, MessageCircle, Phone, Trash2 } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function LeadItem(props: {
  lead: TLead;
  index: number;
  storeId: string;
}) {
  const { lead, index } = props;

  return (
    <Accordion type='multiple' key={lead._id}>
      <AccordionItem value={lead._id} className='w-full'>
        <AccordionTrigger>Lead #{index + 1}</AccordionTrigger>
        <AccordionContent className='px-4 py-4'>
          <div className='space-y-2'>
            <h3 className='text-lg font-semibold'>Name: {lead.name}</h3>
            <p className='text-sm text-foreground'>Contact: {lead.phone}</p>
            <p className='text-sm text-foreground'>
              Location: {getCountryName(lead.country)}
            </p>
            <p className='text-sm text-foreground'>
              Date:{' '}
              {new Intl.DateTimeFormat('en-US').format(
                new Date(lead.createdAt)
              )}
            </p>
            <p className='text-sm text-foreground'>
              Time: {new Date(lead.createdAt).toLocaleTimeString()}
            </p>
          </div>

          <div className='space-y-1 text-sm'>
            <h3 className='flex items-center gap-1'>
              <span className='font-bold'>Subject:</span>
              <p className='text-card-foreground font-medium'>{lead.subject}</p>
            </h3>

            <h3 className='flex items-center gap-1'>
              <span className='font-bold'>Description:</span>
              <p className='text-card-foreground font-medium'>{lead.message}</p>
            </h3>
          </div>

          <div className={cn('mt-6 pt-4 border-t flex items-center gap-3')}>
            <LeadPhoneCallDialog
              phone={lead.phone}
              whatsapp={lead.whatsapp}
              botim={lead.botim}
            >
              <Button variant='outline' size='sm' className='w-full'>
                <Phone className='h-4 w-4 mr-2' />
                Call
              </Button>
            </LeadPhoneCallDialog>

            <LeadPhoneChatDialog
              phone={lead.phone}
              whatsapp={lead.whatsapp}
              botim={lead.botim}
              gmail={lead.email}
            >
              <Button variant='outline' size='sm' className='w-full'>
                <MessageCircle className='h-4 w-4 mr-2' />
                Chat
              </Button>
            </LeadPhoneChatDialog>

            <Link
              to='/dashboard/stores/$id/leads/$listingId'
              params={{
                listingId: lead._id,
                id: props.storeId,
              }}
              search={{
                listingType: lead.entityType,
                page: 1,
                limit: 10,
                listingId: lead.entity._id,
              }}
              className={buttonVariants({
                variant: 'outline',
                size: 'sm',
                className: 'w-full aria-hidden:hidden',
              })}
            >
              <Eye className='h-4 w-4 mr-2' />
              View Leads from this Listing
            </Link>
            <DiscardLeadDialog leadId={lead._id}>
              <Button
                variant='outline'
                size='sm'
                className='w-full text-destructive flex gap-2 hover:text-destructive-foreground hover:bg-destructive'
              >
                <Trash2 className='h-4 w-4' />
                <span>Discard</span>
              </Button>
            </DiscardLeadDialog>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
