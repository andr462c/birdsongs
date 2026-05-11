export interface Bird {
  en: string;
  dk: string;
  genus: string;
  species: string;
}

/** Common birds of Denmark — curated from the IOC / DOF list for Denmark. */
export const BIRDS: Bird[] = [
  // ── Thrushes ──
  { en: "Eurasian Blackbird", dk: "Solsort", genus: "Turdus", species: "merula" },
  { en: "Song Thrush", dk: "Sangdrossel", genus: "Turdus", species: "philomelos" },
  { en: "Mistle Thrush", dk: "Misteldrossel", genus: "Turdus", species: "viscivorus" },
  { en: "Fieldfare", dk: "Sjagger", genus: "Turdus", species: "pilaris" },
  { en: "Redwing", dk: "Vindrossel", genus: "Turdus", species: "iliacus" },
  { en: "Ring Ouzel", dk: "Ringdrossel", genus: "Turdus", species: "torquatus" },

  // ── Chats & flycatchers ──
  { en: "European Robin", dk: "Rødhals", genus: "Erithacus", species: "rubecula" },
  { en: "Thrush Nightingale", dk: "Nattergal", genus: "Luscinia", species: "luscinia" },
  { en: "Common Nightingale", dk: "Sydlig nattergal", genus: "Luscinia", species: "megarhynchos" },
  { en: "Bluethroat", dk: "Blåhals", genus: "Luscinia", species: "svecica" },
  { en: "Black Redstart", dk: "Husrødstjert", genus: "Phoenicurus", species: "ochruros" },
  { en: "Common Redstart", dk: "Rødstjert", genus: "Phoenicurus", species: "phoenicurus" },
  { en: "Whinchat", dk: "Bynkefugl", genus: "Saxicola", species: "rubetra" },
  { en: "European Stonechat", dk: "Sortstrubet bynkefugl", genus: "Saxicola", species: "rubicola" },
  { en: "Northern Wheatear", dk: "Stenpikker", genus: "Oenanthe", species: "oenanthe" },
  { en: "Spotted Flycatcher", dk: "Grå fluesnapper", genus: "Muscicapa", species: "striata" },
  { en: "European Pied Flycatcher", dk: "Broget fluesnapper", genus: "Ficedula", species: "hypoleuca" },
  { en: "Red-breasted Flycatcher", dk: "Lille fluesnapper", genus: "Ficedula", species: "parva" },
  { en: "Collared Flycatcher", dk: "Hvidhalset fluesnapper", genus: "Ficedula", species: "albicollis" },

  // ── Warblers ──
  { en: "Eurasian Blackcap", dk: "Munk", genus: "Sylvia", species: "atricapilla" },
  { en: "Garden Warbler", dk: "Havesanger", genus: "Sylvia", species: "borin" },
  { en: "Greater Whitethroat", dk: "Tornsanger", genus: "Curruca", species: "communis" },
  { en: "Lesser Whitethroat", dk: "Gærdesanger", genus: "Curruca", species: "curruca" },
  { en: "Barred Warbler", dk: "Høgesanger", genus: "Curruca", species: "nisoria" },
  { en: "Willow Warbler", dk: "Løvsanger", genus: "Phylloscopus", species: "trochilus" },
  { en: "Common Chiffchaff", dk: "Gransanger", genus: "Phylloscopus", species: "collybita" },
  { en: "Wood Warbler", dk: "Skovsanger", genus: "Phylloscopus", species: "sibilatrix" },
  { en: "Eurasian Reed Warbler", dk: "Rørsanger", genus: "Acrocephalus", species: "scirpaceus" },
  { en: "Sedge Warbler", dk: "Sivsanger", genus: "Acrocephalus", species: "schoenobaenus" },
  { en: "Marsh Warbler", dk: "Kærsanger", genus: "Acrocephalus", species: "palustris" },
  { en: "Great Reed Warbler", dk: "Drosselrørsanger", genus: "Acrocephalus", species: "arundinaceus" },
  { en: "Icterine Warbler", dk: "Gulbug", genus: "Hippolais", species: "icterina" },
  { en: "Common Grasshopper Warbler", dk: "Græshoppesanger", genus: "Locustella", species: "naevia" },
  { en: "River Warbler", dk: "Flodsanger", genus: "Locustella", species: "fluviatilis" },
  { en: "Savi's Warbler", dk: "Savisanger", genus: "Locustella", species: "luscinioides" },
  { en: "Goldcrest", dk: "Fuglekonge", genus: "Regulus", species: "regulus" },
  { en: "Common Firecrest", dk: "Rødtoppet fuglekonge", genus: "Regulus", species: "ignicapilla" },

  // ── Tits ──
  { en: "Great Tit", dk: "Musvit", genus: "Parus", species: "major" },
  { en: "Eurasian Blue Tit", dk: "Blåmejse", genus: "Cyanistes", species: "caeruleus" },
  { en: "Coal Tit", dk: "Sortmejse", genus: "Periparus", species: "ater" },
  { en: "Marsh Tit", dk: "Sumpmejse", genus: "Poecile", species: "palustris" },
  { en: "Willow Tit", dk: "Fyrremejse", genus: "Poecile", species: "montanus" },
  { en: "Crested Tit", dk: "Topmejse", genus: "Lophophanes", species: "cristatus" },
  { en: "Long-tailed Tit", dk: "Halemejse", genus: "Aegithalos", species: "caudatus" },

  // ── Nuthatch & treecreepers ──
  { en: "Eurasian Nuthatch", dk: "Spætmejse", genus: "Sitta", species: "europaea" },
  { en: "Eurasian Treecreeper", dk: "Træløber", genus: "Certhia", species: "familiaris" },
  { en: "Short-toed Treecreeper", dk: "Korttået træløber", genus: "Certhia", species: "brachydactyla" },

  // ── Wren ──
  { en: "Eurasian Wren", dk: "Gærdesmutte", genus: "Troglodytes", species: "troglodytes" },

  // ── Larks ──
  { en: "Eurasian Skylark", dk: "Sanglærke", genus: "Alauda", species: "arvensis" },
  { en: "Wood Lark", dk: "Hedelærke", genus: "Lullula", species: "arborea" },
  { en: "Crested Lark", dk: "Toplærke", genus: "Galerida", species: "cristata" },

  // ── Swallows ──
  { en: "Barn Swallow", dk: "Landsvale", genus: "Hirundo", species: "rustica" },
  { en: "Common House Martin", dk: "Bysvale", genus: "Delichon", species: "urbicum" },
  { en: "Sand Martin", dk: "Digesvale", genus: "Riparia", species: "riparia" },

  // ── Starling ──
  { en: "Common Starling", dk: "Stær", genus: "Sturnus", species: "vulgaris" },

  // ── Sparrows & accentors ──
  { en: "House Sparrow", dk: "Gråspurv", genus: "Passer", species: "domesticus" },
  { en: "Eurasian Tree Sparrow", dk: "Skovspurv", genus: "Passer", species: "montanus" },
  { en: "Dunnock", dk: "Jernspurv", genus: "Prunella", species: "modularis" },

  // ── Wagtails & pipits ──
  { en: "White Wagtail", dk: "Hvid vipstjert", genus: "Motacilla", species: "alba" },
  { en: "Grey Wagtail", dk: "Bjergvipstjert", genus: "Motacilla", species: "cinerea" },
  { en: "Western Yellow Wagtail", dk: "Gul vipstjert", genus: "Motacilla", species: "flava" },
  { en: "Meadow Pipit", dk: "Engpiber", genus: "Anthus", species: "pratensis" },
  { en: "Tree Pipit", dk: "Skovpiber", genus: "Anthus", species: "trivialis" },

  // ── Finches ──
  { en: "Common Chaffinch", dk: "Bogfinke", genus: "Fringilla", species: "coelebs" },
  { en: "Brambling", dk: "Kvækerfinke", genus: "Fringilla", species: "montifringilla" },
  { en: "European Greenfinch", dk: "Grønirisk", genus: "Chloris", species: "chloris" },
  { en: "European Goldfinch", dk: "Stillits", genus: "Carduelis", species: "carduelis" },
  { en: "Eurasian Linnet", dk: "Tornirisk", genus: "Linaria", species: "cannabina" },
  { en: "Eurasian Siskin", dk: "Grønsisken", genus: "Spinus", species: "spinus" },
  { en: "Redpoll", dk: "Gråsisken", genus: "Acanthis", species: "flammea" },
  { en: "Red Crossbill", dk: "Lille korsnæb", genus: "Loxia", species: "curvirostra" },
  { en: "Parrot Crossbill", dk: "Stor korsnæb", genus: "Loxia", species: "pytyopsittacus" },
  { en: "Eurasian Bullfinch", dk: "Dompap", genus: "Pyrrhula", species: "pyrrhula" },
  { en: "Hawfinch", dk: "Kernebider", genus: "Coccothraustes", species: "coccothraustes" },
  { en: "Common Rosefinch", dk: "Karmindompap", genus: "Carpodacus", species: "erythrinus" },

  // ── Buntings ──
  { en: "Yellowhammer", dk: "Gulspurv", genus: "Emberiza", species: "citrinella" },
  { en: "Reed Bunting", dk: "Rørspurv", genus: "Emberiza", species: "schoeniclus" },
  { en: "Corn Bunting", dk: "Bomlærke", genus: "Emberiza", species: "calandra" },
  { en: "Ortolan Bunting", dk: "Hortulan", genus: "Emberiza", species: "hortulana" },
  { en: "Snow Bunting", dk: "Snespurv", genus: "Plectrophenax", species: "nivalis" },

  // ── Shrikes, oriole & waxwing ──
  { en: "Red-backed Shrike", dk: "Rødrygget tornskade", genus: "Lanius", species: "collurio" },
  { en: "Great Grey Shrike", dk: "Stor tornskade", genus: "Lanius", species: "excubitor" },
  { en: "Eurasian Golden Oriole", dk: "Pirol", genus: "Oriolus", species: "oriolus" },
  { en: "Bohemian Waxwing", dk: "Silkehale", genus: "Bombycilla", species: "garrulus" },

  // ── Corvids ──
  { en: "Eurasian Jay", dk: "Skovskade", genus: "Garrulus", species: "glandarius" },
  { en: "Eurasian Magpie", dk: "Husskade", genus: "Pica", species: "pica" },
  { en: "Eurasian Jackdaw", dk: "Allike", genus: "Coloeus", species: "monedula" },
  { en: "Rook", dk: "Råge", genus: "Corvus", species: "frugilegus" },
  { en: "Hooded Crow", dk: "Gråkrage", genus: "Corvus", species: "cornix" },
  { en: "Common Raven", dk: "Ravn", genus: "Corvus", species: "corax" },

  // ── Other passerines ──
  { en: "Bearded Reedling", dk: "Skægmejse", genus: "Panurus", species: "biarmicus" },
  { en: "White-throated Dipper", dk: "Vandstær", genus: "Cinclus", species: "cinclus" },
  { en: "Eurasian Penduline Tit", dk: "Pungmejse", genus: "Remiz", species: "pendulinus" },

  // ── Cuckoo & nightjar ──
  { en: "Common Cuckoo", dk: "Gøg", genus: "Cuculus", species: "canorus" },
  { en: "Eurasian Nightjar", dk: "Natravn", genus: "Caprimulgus", species: "europaeus" },

  // ── Woodpeckers ──
  { en: "Eurasian Green Woodpecker", dk: "Grønspætte", genus: "Picus", species: "viridis" },
  { en: "Great Spotted Woodpecker", dk: "Stor flagspætte", genus: "Dendrocopos", species: "major" },
  { en: "Black Woodpecker", dk: "Sortspætte", genus: "Dryocopus", species: "martius" },
  { en: "Lesser Spotted Woodpecker", dk: "Lille flagspætte", genus: "Dryobates", species: "minor" },
  { en: "Eurasian Wryneck", dk: "Vendehals", genus: "Jynx", species: "torquilla" },

  // ── Kingfisher, hoopoe, bee-eater ──
  { en: "Common Kingfisher", dk: "Isfugl", genus: "Alcedo", species: "atthis" },
  { en: "Eurasian Hoopoe", dk: "Hærfugl", genus: "Upupa", species: "epops" },
  { en: "European Bee-eater", dk: "Biæder", genus: "Merops", species: "apiaster" },

  // ── Pigeons & doves ──
  { en: "Common Wood Pigeon", dk: "Ringdue", genus: "Columba", species: "palumbus" },
  { en: "Eurasian Collared Dove", dk: "Tyrkerdue", genus: "Streptopelia", species: "decaocto" },
  { en: "Stock Dove", dk: "Huldue", genus: "Columba", species: "oenas" },

  // ── Rails & cranes ──
  { en: "Water Rail", dk: "Vandrikse", genus: "Rallus", species: "aquaticus" },
  { en: "Corn Crake", dk: "Engsnarre", genus: "Crex", species: "crex" },
  { en: "Common Moorhen", dk: "Grønbenet rørhøne", genus: "Gallinula", species: "chloropus" },
  { en: "Eurasian Coot", dk: "Blishøne", genus: "Fulica", species: "atra" },
  { en: "Common Crane", dk: "Trane", genus: "Grus", species: "grus" },

  // ── Waders ──
  { en: "Eurasian Curlew", dk: "Storspove", genus: "Numenius", species: "arquata" },
  { en: "Common Snipe", dk: "Dobbeltbekkasin", genus: "Gallinago", species: "gallinago" },
  { en: "Eurasian Woodcock", dk: "Skovsneppe", genus: "Scolopax", species: "rusticola" },
  { en: "Northern Lapwing", dk: "Vibe", genus: "Vanellus", species: "vanellus" },
  { en: "Eurasian Oystercatcher", dk: "Strandskade", genus: "Haematopus", species: "ostralegus" },

  // ── Game birds ──
  { en: "Common Quail", dk: "Vagtel", genus: "Coturnix", species: "coturnix" },
  { en: "Grey Partridge", dk: "Agerhøne", genus: "Perdix", species: "perdix" },

  // ── Owls ──
  { en: "Tawny Owl", dk: "Natugle", genus: "Strix", species: "aluco" },
  { en: "Long-eared Owl", dk: "Skovhornugle", genus: "Asio", species: "otus" },
  { en: "Short-eared Owl", dk: "Mosehornugle", genus: "Asio", species: "flammeus" },
  { en: "Western Barn Owl", dk: "Slørugle", genus: "Tyto", species: "alba" },

  // ── Raptors ──
  { en: "Common Buzzard", dk: "Musvåge", genus: "Buteo", species: "buteo" },
  { en: "Eurasian Kestrel", dk: "Tårnfalk", genus: "Falco", species: "tinnunculus" },
  { en: "Peregrine Falcon", dk: "Vandrefalk", genus: "Falco", species: "peregrinus" },
  { en: "White-tailed Eagle", dk: "Havørn", genus: "Haliaeetus", species: "albicilla" },

  // ── Waterbirds ──
  { en: "Grey Heron", dk: "Fiskehejre", genus: "Ardea", species: "cinerea" },
  { en: "Eurasian Bittern", dk: "Rørdrum", genus: "Botaurus", species: "stellaris" },
  { en: "White Stork", dk: "Hvid stork", genus: "Ciconia", species: "ciconia" },
  { en: "Mute Swan", dk: "Knopsvane", genus: "Cygnus", species: "olor" },
  { en: "Greylag Goose", dk: "Grågås", genus: "Anser", species: "anser" },
  { en: "Little Grebe", dk: "Lille lappedykker", genus: "Tachybaptus", species: "ruficollis" },
  { en: "Great Crested Grebe", dk: "Toppet lappedykker", genus: "Podiceps", species: "cristatus" },
];

/** Bird groups for UI organization. Each group's count corresponds to consecutive entries in BIRDS. */
export const BIRD_GROUPS: { name: string; count: number }[] = [
  { name: "Thrushes", count: 6 },
  { name: "Chats & Flycatchers", count: 13 },
  { name: "Warblers", count: 18 },
  { name: "Tits", count: 7 },
  { name: "Nuthatch & Treecreepers", count: 3 },
  { name: "Wren", count: 1 },
  { name: "Larks", count: 3 },
  { name: "Swallows", count: 3 },
  { name: "Starling", count: 1 },
  { name: "Sparrows & Accentors", count: 3 },
  { name: "Wagtails & Pipits", count: 5 },
  { name: "Finches", count: 12 },
  { name: "Buntings", count: 5 },
  { name: "Shrikes, Oriole & Waxwing", count: 4 },
  { name: "Corvids", count: 6 },
  { name: "Other Passerines", count: 3 },
  { name: "Cuckoo & Nightjar", count: 2 },
  { name: "Woodpeckers", count: 5 },
  { name: "Kingfisher, Hoopoe & Bee-eater", count: 3 },
  { name: "Pigeons & Doves", count: 3 },
  { name: "Rails & Cranes", count: 5 },
  { name: "Waders", count: 5 },
  { name: "Game Birds", count: 2 },
  { name: "Owls", count: 4 },
  { name: "Raptors", count: 4 },
  { name: "Waterbirds", count: 7 },
];
