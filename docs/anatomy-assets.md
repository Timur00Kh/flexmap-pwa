# Anatomy model attribution

The app includes the unmodified `ecorche.meshopt.glb` model from [Écorché](https://github.com/Charleeh/ecorche/blob/main/model/ecorche.meshopt.glb), licensed under [Creative Commons Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/). The model is displayed with application-selected colours; its geometry is not modified.

Écorché (https://github.com/Charleeh/ecorche), CC BY-SA 4.0. Based on BodyParts3D, © The Database Center for Life Science, CC BY 4.0, and Z-Anatomy by Gauthier Kervyn, CC BY-SA 4.0.

Original project: [credits and provenance](https://github.com/Charleeh/ecorche/blob/main/ATTRIBUTION.md), [licence](https://github.com/Charleeh/ecorche/blob/main/LICENSE.md), [model and construction details](https://github.com/Charleeh/ecorche). Source datasets: [BodyParts3D licence](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html) and [Z-Anatomy](https://www.z-anatomy.com/).

The model depicts a single adult male body. It is an educational visualisation, not a clinical model. The application's nine exercise groups are broad associations, not a medical classification of muscle function. This copy is meshopt-compressed, approximately 5.7 MB, and is loaded locally.

For rendering, the application applies the source transforms and merges the static meshes into 11 runtime batches (nine selectable groups, neutral structures and bones). The original GLB remains unchanged and bundled with its license. A BVH accelerates picking. Runtime batching preserves the source bounds, vertex count and triangle count.
