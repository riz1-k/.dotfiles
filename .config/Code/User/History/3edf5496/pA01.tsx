import { useState } from 'react';
import {
  Credenza,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from '@/components/ui/credenza';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { BUSINESS_CONTACT_TYPES } from './onboard-profile-form';
import { toast } from 'sonner';
import { phoneSchema } from '@/lib/utils/phone-utils';

const ContactInfoDialog = (props: {
  onAdd: ({
    fieldType,
    value,
    type,
  }: {
    fieldType: string;
    value: string;
    type: string | undefined;
  }) => void;
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [fieldType, setFieldType] =
    useState<(typeof BUSINESS_CONTACT_TYPES)[number]>();
  const [value, setValue] = useState<string>();
  const [type, setType] = useState<string>();

  const fieldTypes: {
    label: string;
    value: (typeof BUSINESS_CONTACT_TYPES)[number];
  }[] = [
    {
      label: 'Number',
      value: 'NUMBER',
    },
    {
      label: 'Social Links',
      value: 'SOCIAL',
    },
    {
      label: 'Website URL',
      value: 'WEBSITE',
    },
  ];

  const appNames = [
    'Bdum',
    'IMO',
    'Viber',
    'Line',
    'QQChat',
    'Landline',
    'Telegram',
    'Skype',
    'Signal',
    'Google Voice',
    'Local Whatsapp',
    'International Whatsapp',
    'International Phone',
  ];
  const socialPlatforms = [
    'Facebook',
    'Snapchat',
    'Instagram',
    'LinkedIn',
    'HeyWow',
    'Twitter',
    'Pinterest',
    'Youtube',
    'TikTok (For Non-Indian Sellers Only)',
  ];

  return (
    <Credenza open={showDialog} onOpenChange={setShowDialog}>
      <CredenzaTrigger asChild>
        <Button variant='outline' className='px-8 py-3 rounded-full'>
          <Plus className='w-4 h-4' />
          Add More
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Add Contact Information</CredenzaTitle>
        </CredenzaHeader>
        <div className='grid gap-4 py-4'>
          <Select
            value={fieldType}
            onValueChange={(value: (typeof fieldTypes)[number]['value']) => {
              setFieldType(value);
              setValue(undefined);
              setType(undefined);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select Field Type' />
            </SelectTrigger>
            <SelectContent>
              {fieldTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {fieldType === 'NUMBER' && (
            <>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder='Select App Name (optional)' />
                </SelectTrigger>
                <SelectContent>
                  {appNames.map((app) => (
                    <SelectItem key={app} value={app}>
                      {app}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder='Enter Number with Country Code'
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </>
          )}

          {fieldType === 'SOCIAL' && (
            <>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder='Select Social Platform' />
                </SelectTrigger>
                <SelectContent>
                  {socialPlatforms.map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder='Enter Social Profile URL'
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </>
          )}

          {fieldType === 'WEBSITE' && (
            <Input
              placeholder='Enter Website URL'
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          )}

          <Button
            type='button'
            disabled={!fieldType || !value}
            onClick={() => {
              if (!fieldType || !value) return;
              const urlRegex =
                /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
              if (
                (fieldType === 'SOCIAL' || fieldType === 'WEBSITE') &&
                !urlRegex.test(value)
              ) {
                return toast.error('Invalid URL');
              }
              const validate = phoneSchema.safeParse(value);
              if (
                fieldType === 'NUMBER' &&
                !phoneSchema.safeParse(value).success
              ) {
                return toast.error(validate.error?.errors?.[0]?.message);
              }
              props.onAdd({
                fieldType,
                value,
                type,
              });
              setShowDialog(false);
              setFieldType(undefined);
              setValue(undefined);
              setType(undefined);
            }}
          >
            Add
          </Button>
        </div>
      </CredenzaContent>
    </Credenza>
  );
};

export default ContactInfoDialog;
