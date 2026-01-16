import { supabase } from '../config/supabase.js'

export const subirArchivoSupabase = async (file, carpeta) => {
  const nombreArchivo = `${Date.now()}_${file.originalname}`

  const { error } = await supabase.storage
    .from('seguimiento')
    .upload(`${carpeta}/${nombreArchivo}`, file.buffer, {
      contentType: file.mimetype
    })

  if (error) {
    console.error('Error subiendo archivo:', error)
    throw new Error('Error al subir archivo a Supabase')
  }

  const { data } = supabase.storage
    .from('seguimiento')
    .getPublicUrl(`${carpeta}/${nombreArchivo}`)

  return {
    url: data.publicUrl,
    nombre_original: file.originalname
  }
}
