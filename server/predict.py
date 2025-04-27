import cv2
import torch
from ultralytics import YOLO
import numpy as np
model = YOLO("model/best.pt")
img = cv2.imread("/Users/sunnychen/Downloads/MTDC-UAV/Detection/images/train/DJI_0002_0_1.JPG")
results = model.predict(img)

# 可视化并保存结果
for i, result in enumerate(results):
    # 绘制检测框
    img_np = result.orig_img
    for box in result.boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
        cv2.rectangle(img_np, (x1, y1), (x2, y2), (0, 255, 0), 2)
    
    # 保存带检测框的图片
    output_path = f'output_{i}.jpg'
    cv2.imwrite(output_path, cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR))