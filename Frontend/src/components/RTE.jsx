import React from 'react'
import {Editor} from '@tinymce/tinymce-react'
import {Controller} from 'react-hook-form'


function RTE({
    name,
    control,
    label,
    defaultValue = "Hello Baby !"
}) {
  return (
    <div className='w-full mt-12'>
        {
            label && <label className='inline-block mb-1 pl-1'>{label}</label>
        }
        <Controller
            name={name}
            control={control}
            render={({field : {onChange}})=>(
                <Editor
                    apiKey={import.meta.env.VITE_TINY_API_KEY}
                    initialValue={defaultValue}
                    init={
                        {
                            branding : false,
                            height : 400,
                            menubar : true,
                            plugins: [
                                'advlist autolink lists link image charmap print preview anchor',
                                'searchreplace visualblocks code fullscreen',
                                'insertdatetime media table paste code help wordcount',
                                'emoticons template paste textpattern imagetools'
                              ],
                              toolbar: 'undo redo | formatselect | ' +
                                'bold italic underline strikethrough forecolor backcolor | ' +
                                'alignleft aligncenter alignright alignjustify | ' +
                                'bullist numlist outdent indent | removeformat | ' +
                                'link image media emoticons | ' +
                                'code fullscreen preview',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                            content_css : ''
                        }
                    }
                    onEditorChange={onChange}
                />
            )}
        />
    </div>
  )
}

export default RTE