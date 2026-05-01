import {createClient} from '@supabase/supabase-js'

const supabaseUrl = 'https://tnzpycbkgjrshvtpbfca.supabase.co'
const supabaseKey = 'sb_publishable_UgpYzQLgTjS_TR66DuzNmw_TG3EqPFc'

export const supabase = createClient(supabaseUrl, supabaseKey)